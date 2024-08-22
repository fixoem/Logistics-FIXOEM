import { json } from "@remix-run/node";
import React from "react";
import { useState, useCallback } from 'react';
import { useLoaderData, useActionData, useFetcher } from "@remix-run/react";
import { Page, Card, TextField, Form, FormLayout, Button, ButtonGroup, Badge, Grid, Text, DataTable, Divider, Thumbnail, Modal, Select, Layout, Box, DropZone, InlineStack, InlineGrid, Banner, List } from "@shopify/polaris";
import {NoteIcon} from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { getDevolutionById, updateRequiresLabel, updateShippingLabel, updateShippingPayment, updateStatus, updateSubsidiary, updateResolution } from '../server/Devolution.server';

import DevolutionSection from '../components/DevolutionSection';
import ResolutionModal from "../components/ResolutionModel";
import Order from '../components/Order';
import EvidenceModal from "../components/EvidenceModal";
import SaveIndoModal from "../components/SaveInfoModal";
import { useFeatures } from "@shopify/polaris/build/ts/src/utilities/features";


/**
 * Actualizar datos cuando de clic en guarda
 * Obtener la info del producto de bd y mostrarla
 * Funcion para subir imagenes y obtener la url para guardarla en bd
 * */

export async function loader({ request, params }) {

    const { admin, session } = await authenticate.admin(request);
    const devolution = await getDevolutionById(params.id ,admin.graphql);

    return json({
        devolution
    });

}

export async function action({request, params}) {
    const formData = await request.formData();
    const actionType = formData.get("actionType");

    switch (actionType) {
        case "updateDevolution":
            const status = formData.get("statusSelect");
            const subsidiary = formData.get("subsidiarySelect");
            const paymentDone = formData.get("paymentDone");
            const requieredShipping = formData.get("requiredShipping");
            const file = formData.get("file");

            await updateStatus(params.id, status);
            await updateSubsidiary(params.id, subsidiary);
            await updateRequiresLabel(params.id, requieredShipping);
            await updateShippingLabel(params.id, file);
            await updateShippingPayment(params.id, paymentDone);

            break;

        case "updateResolution":

            const comment  = formData.get("commentaries");
            const creditNote = formData.get("ndc");
            const images = formData.get("newImages");

            await updateResolution(params.id, comment, creditNote, images);

            break;

        default:
            break;
    }


    return json({ success: true });

}

export default function Refund() {

    const { devolution } = useLoaderData();
    const action = useActionData();
    const fetcher = useFetcher();

    const handleSave = () => {
        fetcher.submit(
            {   
                actionType: "updateDevolution",
                statusSelect: stateSelected,
                subsidiarySelect: subsidiarySelected,
                paymentDone: paymentShipping,
                requiredShipping: requiresShipping == "shipping" ? true : false,
                file: fileShipping ? fileShipping.name : ""
            },
            { method: "post"}
        );
    };

    const handleSaveResolution = () => {
        fetcher.submit(
            {
                actionType: "updateResolution",
                commentaries: commentariesText,
                ndc: creditNoteText,
                newImages: filesResolution.map( (file) => String(file.name) )
            },
            { method: "post" }
        );
    }

    // ======================= DEVOLUTION SECTION ===========================
    const [ paymentShipping, setPaymentShipping ] = useState<boolean>(devolution.shippingPayment);
    const handlePaymentShipping = useCallback(
        (newChecked: boolean) => setPaymentShipping(newChecked),
        [],
    );

    const [requiresShipping , setRequireShipping] = React.useState('shipping');
    const handleRequiresShipping = useCallback(
        (_: boolean, newValue: string) => setRequireShipping(newValue),
        []
    );

    const [fileShipping, setFile] = useState<File>();
    const handleDropZoneShipping = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
        setFile(acceptedFiles[0]),
        [],
    );

    // ================== END DEVOLUTION SECTION ========================
    
    // ================== RESOLUTION SECTION ============================
    const [resolutionOption , setResolutionOption] = React.useState('denied');
    const handleChangeResolutionOption = useCallback(
        (_: boolean, newValue: string) => setResolutionOption(newValue),
        []
    );

    const [creditNoteText, setCreditNoteText] = useState<string>("");
    const handleCreditNoteText = useCallback((value : string) => setCreditNoteText(value), []);

    const [commentariesText, setCommentariesText] = useState<string>("")
    const handleCommentariesText = useCallback((value : string) => setCommentariesText(value), []);

    const [filesResolution, setFiles] = useState<File[]>([]);
    const [rejectedResolutionFiles, setRejectedResolutionFiles] = useState<File[]>([]);
    const hasError = rejectedResolutionFiles.length > 0;

    const handleDropZoneDrop = useCallback(
        (_droppedFiles: File[], acceptedFiles: File[], rejectedFiles: File[]) => {
          setFiles((files) => [...files, ...acceptedFiles]);
          setRejectedResolutionFiles(rejectedFiles);
        },
        [],
    );

    const errorMessage = hasError && (
        <Banner title="Las siguientes imanges no pudieron subirse:" tone="critical">
          <List type="bullet">
            {rejectedResolutionFiles.map((file, index) => (
              <List.Item key={index}>
                {`"${file.name}" no es soportada. El archivo debe ser .jpg, .png.`}
              </List.Item>
            ))}
          </List>
        </Banner>
    );

    // =============== END RESOLUTION SECTION ============================
    
    // Modal Show Image
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const handleImageClick = (src: string) => {
        setSelectedImage(src);
    };
    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    // Show Resolution Modal
    const [ modalResolution, setModalResolution] = useState<boolean>(false);
    const handlerModalResolution = () => setModalResolution(!modalResolution);
    
    // Show Modal to Save Info
    const [ saveModal, setSaveModal ] = useState<boolean>(false);
    const handlerSaveModal = useCallback(() => setSaveModal( (saveModal) => !saveModal ), []);

    // Evidence Images Map List
    const evidenceImages = devolution.images.map( ( item ) => {
        return(
            <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>

                <div style={{ textAlign: 'center' }}>
                    <img 
                        onClick={() => { handleImageClick(`${item.image}`) }}
                        style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
                        src={item.image}
                        alt={item.image}
                    />
                </div>
                
            </Grid.Cell>
        )
    });

    // Articles Map List
    const handleArticles = devolution.items.map( (item) => {
        return (
            <>
                <Grid.Cell >
                    <Text as="p" variant="bodySm">
                        {item.sku}
                    </Text>
                </Grid.Cell>
                <Grid.Cell>
                    <Text as="p" variant="bodySm">
                        {item.quantity}
                    </Text>
                </Grid.Cell>
                <Divider borderColor="transparent" borderWidth={'025'}/> 
                <Divider borderColor="transparent" borderWidth={'025'}/> 
            </>
    )});

    const formatDate = (dateString: string) => {

        const months = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} de ${month} de ${year}`;
        
    };

    // State of the invoice 
    const [stateSelected, setSelected] = useState(devolution.status); // From DB
    const handleStateSelected = useCallback(
        (value: string) => setSelected(value),
        [],
    );
    const stateOptions = [
        {label: 'Devolución Solicitada', value: 'Devolución Solicitada'},
        {label: 'Atendida', value: 'Atendida'},
        {label: 'En Transito', value: 'En Transito'},
        {label: 'Aceptada', value: 'Aceptada'},
        {label: 'Rechazada', value: 'Rechazada'},
    ];

    // Subsidiary in charge of the invoice
    const [subsidiarySelected, setSubsidiarySelected] = useState(devolution.sucursal); // From DB
    const subsidiaryOptions = [
        {label: 'Cedis', value: 'Cedis'},
        {label: 'Monterrey', value: 'Monterrey'},
        {label: 'Puebla', value: 'Puebla'},
        {label: 'Queretaro', value: 'Queretaro'},
        {label: 'Tijuana', value: 'Tijuana'},
    ];
    const handleSubsidiarySelected = useCallback(
        (value: string) => setSubsidiarySelected(value),
        [],
    );

    
    return (
    <Page 
        backAction={{content: 'Volver', url: '/app/refunds'}}
        title={`#${devolution.id}`}
        compactTitle
        titleMetadata={
            <>
                {stateSelected == "Devolución Solicitada" ? (
                    <Badge progress="complete" tone="critical">{stateSelected}</Badge>
                ) :stateSelected == "Atendida" ? (
                    <Badge progress="complete" tone="attention">{stateSelected}</Badge>
                ) : stateSelected == "En Transito" ? (
                    <Badge progress="complete" tone="info">{stateSelected}</Badge>
                ) : stateSelected == "Aceptada" ? (
                    <Badge progress="complete" tone="success">{stateSelected}</Badge>
                ) : stateSelected == "Rechazada" ? (
                    <Badge progress="complete">{stateSelected}</Badge>
                ) : null}
                <Badge>{subsidiarySelected}</Badge>
                <Badge>{devolution.mainReason}</Badge>
            </>
        }
        subtitle={formatDate(devolution.createdAt)}
        primaryAction={
            <Button variant="primary" onClick={handleSave}>Guardar</Button>
        }
        secondaryActions={
            <Button onClick={handlerModalResolution}>Resolución</Button>
        }
        >
            <Layout>
                <Layout.Section>
                    <Card>

                        {stateSelected == "Devolución Solicitada" ? (
                            <Badge progress="complete" tone="critical">{stateSelected}</Badge>
                        ) : stateSelected == "Atendida" ? (
                            <Badge progress="complete" tone="attention">{stateSelected}</Badge>
                        ) : stateSelected == "En Transito" ? (
                            <Badge progress="complete" tone="info">{stateSelected}</Badge>
                        ) : stateSelected == "Aceptada" ? (
                            <Badge progress="complete" tone="success">{stateSelected}</Badge>
                        ) : stateSelected == "Rechazada" ? (
                            <Badge progress="complete">{stateSelected}</Badge>
                        ) : null}

                        <Divider borderColor="transparent" borderWidth={'100'}/> 
                        
                        <Box 
                            borderColor="border"
                            borderWidth="025"
                            borderRadius="300"
                            >

                            <Box padding="200">

                                <Box paddingBlock="100">
                                    <Text as="p" variant="bodySm" fontWeight='medium'>
                                        Fecha en que el cliente recibió el producto
                                    </Text>
                                    <Text as="p" variant="bodySm">
                                        {devolution.dateProductArrive}
                                    </Text>
                                </Box>

                                <Box paddingBlock="100">
                                    <Text as="p" variant="bodySm" fontWeight='medium'>
                                        Motivos
                                    </Text>

                                
                                    <Text as="p" variant="bodySm">
                                    {devolution.mainReason}: {devolution.explanation}
                                    </Text>
                                </Box>

                            </Box>

                            <Divider/>

                            <Box padding="200">

                                <Box paddingBlock="200">
                                    <InlineGrid columns={['oneHalf', 'oneHalf']}>
                                        <Grid.Cell >
                                            <Text as="p" variant="bodySm">
                                                SKU
                                            </Text>
                                        </Grid.Cell>
                                        <Grid.Cell>
                                            <Text as="p" variant="bodySm">
                                                Pza
                                            </Text>
                                        </Grid.Cell>
                                        <Divider borderColor="transparent" borderWidth={'100'}/> 
                                        <Divider borderColor="transparent" borderWidth={'100'}/> 
                                        <Divider borderColor="transparent" borderWidth={'100'}/> 
                                        <Divider borderColor="transparent" borderWidth={'100'}/> 
                                        {handleArticles}
                                    </InlineGrid>
                                </Box>
                            
                            </Box>

                            <Divider/>

                            <Box padding="200">

                                <Box paddingBlock="200">
                                    <Grid columns={{md: 2, lg: 2, xl: 2}}>
                                        {evidenceImages}                               
                                    </Grid>
                                </Box>
                            
                            </Box>

                            <Divider/>


                            <Box padding={"200"}>
                            </Box>
                           
                        </Box>
                        

                    </Card>

                    <Divider borderColor="transparent" borderWidth={'100'}/> 
                    <Divider borderColor="transparent" borderWidth={'100'}/> 
                    <Divider borderColor="transparent" borderWidth={'100'}/> 
                    <Divider borderColor="transparent" borderWidth={'100'}/> 

                    <DevolutionSection 
                        isPaymentDone={paymentShipping}
                        onPaymentChange={handlePaymentShipping}
                        optionValue={requiresShipping} 
                        onOptionChange={handleRequiresShipping} 
                        onFileDrop={handleDropZoneShipping} 
                        file={fileShipping}
                    />

                </Layout.Section>

                <Layout.Section variant="oneThird">

                    <Order 
                        ticketNumber={devolution.ticketNumber}
                        orderNumber={devolution.orderNumber}
                        clientNumber={devolution.clientNumber}
                        clientPhone={devolution.clientPhone ? devolution.clientPhone : 8989898989}
                        />

                    <Divider borderColor="transparent" borderWidth={'100'}/>
                    <Divider borderColor="transparent" borderWidth={'100'}/>
                    <Divider borderColor="transparent" borderWidth={'100'}/>

                    <Card >
                        <FormLayout>
                            <Select
                                label="Estado"
                                options={stateOptions}
                                value={stateSelected}
                                onChange={handleStateSelected}
                            />
                            <Select
                                label="Sucursal"
                                options={subsidiaryOptions}
                                value={subsidiarySelected}
                                onChange={handleSubsidiarySelected}
                            />
                        </FormLayout> 
                    </Card>

                </Layout.Section>
            </Layout>
            
            
            <EvidenceModal show={selectedImage} closeModal={handleCloseModal} source={selectedImage}/>
            
            <ResolutionModal 
                show={modalResolution} 
                toggleModal={handlerModalResolution} 
                saveInfo={handleSaveResolution}
                resolution={resolutionOption}
                creditNote={creditNoteText}
                commentaries={commentariesText}
                resolutionHandler={handleChangeResolutionOption}
                creditNoteHandler={handleCreditNoteText}
                commentariesHandler={handleCommentariesText}
                files={filesResolution}
                dropZoneHandler={handleDropZoneDrop}
                messageError={errorMessage}
                
                />

            <SaveIndoModal show={saveModal} toggleModal={setSaveModal} />

    </Page>
    );
}

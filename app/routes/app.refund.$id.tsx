
import { json } from "@remix-run/node";
import { useState, useCallback, act } from 'react';
import { useLoaderData } from "@remix-run/react";
import { Page, Card, TextField, FormLayout, Button, ButtonGroup, Badge, Grid, Text, DataTable, Divider, Thumbnail, Modal, Select, Layout, Box, DropZone, InlineStack, InlineGrid, Banner, List } from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { getDevolutionById } from '../models/Devolution.server';

import DevolutionSection from '../components/DevolutionSection';
import ResolutionModal from "../components/ResolutionModel";
import Order from '../components/Order';
import EvidenceModal from "../components/EvidenceModal";
import SaveIndoModal from "../components/SaveInfoModal";


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


export default function Refund() {

    const { devolution } = useLoaderData();

    
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
        {label: 'CEDIS', value: 'CEDIS'},
        {label: 'MONTERREY', value: 'MONTERREY'},
        {label: 'PUEBLA', value: 'PUEBLA'},
        {label: 'QUERETARO', value: 'QUERETARO'},
        {label: 'TIJUANA', value: 'TIJUANA'},
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
            <Button variant="primary" onClick={handlerSaveModal}>Guardar</Button>
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

                    <DevolutionSection isPaymentDone={devolution.shippingPayment} />

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
            

            <ResolutionModal show={modalResolution} toggleModal={handlerModalResolution} />

            <SaveIndoModal show={saveModal} toggleModal={setSaveModal} />

    </Page>
    );
}


import { json } from "@remix-run/node";
import { useState, useCallback } from 'react';
import { useLoaderData } from "@remix-run/react";
import { Page, Card, TextField, FormLayout, Button, ButtonGroup, Badge, Grid, Text, DataTable, Divider, Thumbnail, Modal, Select, Layout, Box, DropZone, InlineStack, InlineGrid, Banner, List } from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { getDevolutionById } from '../models/Devolution.server';

import DevolutionSection from '../components/DevolutionSection';
import ResolutionModal from "../components/ResolutionModel";
import Order from '../components/Order';


export async function loader({ request, params }) {

    const { admin, session } = await authenticate.admin(request);
    const devolution = await getDevolutionById(params.id ,admin.graphql);

    return json({
        devolution
    });

}


export default function Refund() {

    const { devolution } = useLoaderData();

    // Inputs Management
    const [text, setText] = useState("");
    
    // Modal Show Image
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const handleImageClick = (src: string) => {
        setSelectedImage(src);
    };
    
    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    

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


    const [stateSelected, setSelected] = useState(devolution.status); // From DB
    const handleStateSelected = useCallback(
        (value: string) => setSelected(value),
        [],
    );
    const stateOptions = [
        {label: 'Leida', value: 'Leida'},
        {label: 'Atendida', value: 'Atendida'},
        {label: 'En Transito', value: 'En Transito'},
        {label: 'Aceptada', value: 'Acepatada'},
        {label: 'Rechazada', value: 'Rechazada'},
    ];


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
                {devolution.status == "Leida" ? (
                    <Badge progress="complete" tone="critical">{devolution.status}</Badge>
                ) : devolution.status == "Atendida" ? (
                    <Badge progress="complete" tone="attention">{devolution.status}</Badge>
                ) : devolution.status == "En Transito" ? (
                    <Badge progress="complete" tone="info">{devolution.status}</Badge>
                ) : devolution.status == "Aceptada" ? (
                    <Badge progress="complete" tone="success">{devolution.status}</Badge>
                ) : devolution.status == "Rechazada" ? (
                    <Badge progress="complete">{devolution.status}</Badge>
                ) : null}
                <Badge>{devolution.sucursal}</Badge>
                <Badge>{devolution.mainReason}</Badge>
            </>
        }
        subtitle={formatDate(devolution.createdAt)}
        primaryAction={
            <Button variant="primary">Resolución</Button>
        }
        >


            <Layout>
                <Layout.Section>
                    <Card>

                        {devolution.status == "Leida" ? (
                            <Badge progress="complete" tone="critical">{devolution.status}</Badge>
                        ) : devolution.status == "Atendida" ? (
                            <Badge progress="complete" tone="attention">{devolution.status}</Badge>
                        ) : devolution.status == "En Transito" ? (
                            <Badge progress="complete" tone="info">{devolution.status}</Badge>
                        ) : devolution.status == "Aceptada" ? (
                            <Badge progress="complete" tone="success">{devolution.status}</Badge>
                        ) : devolution.status == "Rechazada" ? (
                            <Badge progress="complete">{devolution.status}</Badge>
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
                                        {devolution.createdAt}
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
                                        <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>

                                            <div style={{ textAlign: 'center' }}>
                                                {/* <img 
                                                    onClick={() => { handleImageClick("https://via.placeholder.com/150") }}
                                                    style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
                                                    src="https://via.placeholder.com/150" 
                                                    alt="Evidencia 1" 
                                                /> */}
                                            </div>
                                            
                                        </Grid.Cell>                                
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

                    <DevolutionSection />

                </Layout.Section>

                <Layout.Section variant="oneThird">

                    <Order 
                        ticketNumber={devolution.ticketNumber}
                        orderNumber={devolution.orderNumber}
                        clientNumber={devolution.clientNumber}
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
            
            {selectedImage && (
                <Modal
                open={true}
                onClose={handleCloseModal}
                title="Vista de Evidencia"
                primaryAction={{
                    content: 'Cerrar',
                    onAction: handleCloseModal,
                }}
                >
                    <Modal.Section>
                        <img src={selectedImage} alt="Evidencia Grande" style={{ width: '100%' }} />
                    </Modal.Section>
                </Modal>
            )}

    </Page>
    );
}

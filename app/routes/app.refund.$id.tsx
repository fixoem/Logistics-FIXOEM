
import { json } from "@remix-run/node";
import { useState, useCallback } from 'react';
import { useLoaderData } from "@remix-run/react";
import { 
    Page, 
    Card, 
    TextField, 
    FormLayout, 
    Button, 
    ButtonGroup,
    Badge,
    Grid,
    Text,
    DataTable,
    Divider,
    Modal,
    Select
} from "@shopify/polaris";
import { Tone } from "@shopify/polaris/build/ts/src/components/Badge/types";



export async function loader({ params }: { params: { id: number } }) {
    const { id } = params;
    // Fetch the refund data by id here
    const refund = {
        id,
        invoice: '123456',
        date: '2021-10-10',
        order: '123456',
        ticket: '123456',
        subsidiary: 'Sucursal 1',
        client: 'Cliente 1',
        sku: '123456',
        quantity: 1,
        reason: 'Razón 1',
        creditNote: '123456',
        observations: 'Observaciones 1',
        status: 'success'
    };
    return json(refund);
}

export default function Refund() {

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
      };
    
      const handleCloseModal = () => {
        setSelectedImage(null);
      };
    
    const refund: RefundData = useLoaderData();

    const status: Tone | undefined = refund.status as Tone;

    const formatDate = (dateString: string) => {
        const months = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const date = new Date(dateString  + 'T00:00:00');
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} de ${month} de ${year}`;
      };

    const [stateSelected, setSelected] = useState('pending');

    const stateOptions = [
        {label: 'Pendiente', value: 'pending'},
        {label: 'Aprobada', value: 'approved'},
        {label: 'Rechazada', value: 'rejected'},
    ];

    const handleStateSelected = useCallback(
        (value: string) => setSelected(value),
        [],
    );

    const [subsidiarySelected, setSubsidiarySelected] = useState('CEDIS');

    const subsidiaryOptions = [
        {label: 'CEDIS', value: 'cedis'},
        {label: 'MONTERREY', value: 'monterrey'},
        {label: 'PUEBLA', value: 'puebla'},
        {label: 'QUERETARO', value: 'queretaro'},
        {label: 'TIJUANA', value: 'tijuana'},
    ];

    const handleSubsidiarySelected = useCallback(
        (value: string) => setSubsidiarySelected(value),
        [],
    );
    
    return (
    <Page 
        backAction={{content: 'Volver', url: '/app/refunds'}}
        title={`#${refund.invoice}`}
        compactTitle
        titleMetadata={<><Badge tone="success">Terminada</Badge><Badge>{refund.subsidiary}</Badge><Badge>{refund.reason}</Badge></>}
        subtitle={formatDate(refund.date)}
        >
        
            <Grid columns={{md: 5, lg: 5, xl: 5}}>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                        <Text variant="headingSm" as="h2">
                            No. Pedido
                        </Text>
                        <Text variant="bodySm" as="p">
                            {refund.client}
                        </Text>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                        <Text variant="headingSm" as="h2">
                            No. Ticket
                        </Text>
                        <Text variant="bodySm" as="p">
                            {refund.client}
                        </Text>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                        <Text variant="headingSm" as="h2">
                            No. Cliente
                        </Text>
                        <Text variant="bodySm" as="p">
                            {refund.client}
                        </Text>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                    <Select
                            label="Estado"
                            options={stateOptions}
                            onChange={handleStateSelected}
                            value={stateSelected}
                        />
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                    <Select
                            label="Sucursal"
                            options={subsidiaryOptions}
                            onChange={handleSubsidiarySelected}
                            value={subsidiarySelected}
                        />
                    </Card>
                </Grid.Cell>
            </Grid>

            <Divider borderColor="transparent" borderWidth={'100'}/>
            <Divider borderColor="transparent" borderWidth={'100'}/>
            <Divider borderColor="transparent" borderWidth={'100'}/>

            <Grid columns={{md:1, lg:1, xl:1}}>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                    <Text variant="headingSm" as="h2">
                        Motivo
                    </Text>
                    <Text variant="bodySm" as="p">
                        {refund.reason}
                    </Text>
                    </Card>
                </Grid.Cell>
            </Grid>

            <Divider borderColor="transparent" borderWidth={'100'}/>
            <Divider borderColor="transparent" borderWidth={'100'}/>
            <Divider borderColor="transparent" borderWidth={'100'}/>

            <Grid columns={{md: 2, lg: 2, xl: 2}}>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                        <DataTable
                            columnContentTypes={['text', 'text']}
                            headings={['SKU', 'Cantidad']}
                            rows={refund.products || []}
                        />
                    </Card>

                    <Divider borderColor="transparent" borderWidth={'100'}/>
                    <Divider borderColor="transparent" borderWidth={'100'}/>
                    <Divider borderColor="transparent" borderWidth={'100'}/>

                    <Card >
                        <TextField
                            value={refund.creditNote}
                            onChange={() => {}}
                            multiline
                            autoComplete="off"
                            label="Nota de Credito"
                            placeholder="Ingrese la nota de credito aquí"
                        />
                    </Card>

                    <Divider borderColor="transparent" borderWidth={'100'}/>
                    <Divider borderColor="transparent" borderWidth={'100'}/>
                    <Divider borderColor="transparent" borderWidth={'100'}/>

                    <Card >
                        <TextField
                            value={refund.observations}
                            onChange={() => {}}
                            multiline={5}
                            autoComplete="off"
                            label="Observaciones"
                            placeholder="Ingrese las observaciones aquí"
                        />
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                    <Card >
                        <Text variant="headingSm" as="h2" alignment="center">
                            Evidencias
                        </Text>
                        <Divider />
                        <Divider borderColor="transparent" borderWidth={'100'}/>
                        <Divider borderColor="transparent" borderWidth={'100'}/>
                        <Grid columns={{md: 2, lg: 2, xl: 2}}>
                            <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <img 
                                        onClick={() => { handleImageClick("https://via.placeholder.com/150") }}
                                        style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
                                        src="https://via.placeholder.com/150" 
                                        alt="Evidencia 1" 
                                    />
                                </div>
                                
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ md: 1, lg: 1, xl: 1 }}>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <img 
                                        onClick={() => { handleImageClick("https://via.placeholder.com/150") }}
                                        style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
                                        src="https://via.placeholder.com/150" 
                                        alt="Evidencia 1" 
                                    />
                                </div>
                                
                            </Grid.Cell>
                        </Grid>
                    </Card>

                </Grid.Cell>
            </Grid>

            

            <Divider borderColor="transparent" borderWidth={'100'}/>
            <Divider borderColor="transparent" borderWidth={'100'}/>
            <Divider borderColor="transparent" borderWidth={'100'}/>

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

interface RefundData {
    id: number;
    invoice: string;
    date: string;
    order: string;
    ticket: string;
    subsidiary: string;
    client: string;
    sku: string;
    quantity: string;
    reason: string;
    creditNote: string;
    observations: string;
    status: string;
}
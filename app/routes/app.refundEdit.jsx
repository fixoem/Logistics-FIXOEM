import { 
    Page, 
    Card, 
    TextField, 
    FormLayout, 
    Button 
} from "@shopify/polaris";

export default function refundEdit() {
  return(
        <Page title={`Devolución ${refund.invoice}`}>
            <Form method="post">
                <Card sectioned>
                    <FormLayout>
                        <TextField label="Folio" value={refund.invoice} onChange={() => {}} />
                        <TextField label="Fecha" value={refund.date} onChange={() => {}} />
                        <TextField label="Pedido" value={refund.order} onChange={() => {}} />
                        <TextField label="Ticket" value={refund.ticket} onChange={() => {}} />
                        <TextField label="Sucursal" value={refund.subsidiary} onChange={() => {}} />
                        <TextField label="Cliente" value={refund.client} onChange={() => {}} />
                        <TextField label="SKU" value={refund.sku} onChange={() => {}} />
                        <TextField label="Cantidad" type="number" value={refund.quantity} onChange={() => {}} />
                        <TextField label="Motivo" value={refund.reason} onChange={() => {}} />
                        <TextField label="Nota de crédito" value={refund.creditNote} onChange={() => {}} />
                        <TextField label="Observaciones" value={refund.observations} onChange={() => {}} />
                    </FormLayout>
                    <Button primary submit>Guardar</Button>
                </Card>
            </Form>
        </Page>
  );
}
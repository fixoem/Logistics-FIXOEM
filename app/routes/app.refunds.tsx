import { 
  Page, 
  IndexTable, 
  Card, 
  Badge, 
  useIndexResourceState,
  Text,
  useBreakpoints,
} from "@shopify/polaris";


export default function ProductRefunds() {


  const refund = [
      {
          id: '1',
          invoice: '123456',
          date: '2021-10-10',
          order: '123456',
          ticket: '123456',
          subsidiary: <Badge tone={"success"}>Sucursal 1</Badge>,
          client: 'Cliente 1',
          sku: '123456',
          quantity: 1,
          reason: 'Razón 1',
          status: <Badge progress="complete">Terminada</Badge>,
          creditNote: '123456',
          observations: 'Observaciones 1'
      }
  ]
  const resourceName = {
      singular: 'Devolución',
      plural: 'Devoluciones',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(refund);

  const rowMarkup = refund.map( 
      (
          {id,invoice,date, order, ticket, subsidiary, client, sku, quantity, reason, status, creditNote, observations}, 
          index
      ) => {
          return (
              <IndexTable.Row
              id={id}
              key={index}
              selected={selectedResources.includes(id)}
              position={index}
              onClick={() => { window.location.href = `/app/refunds/${id}`}}
              >
                  <IndexTable.Cell>
                      <Text variant="bodyMd" fontWeight="bold" as="span">
                          {invoice}
                      </Text>    
                  </IndexTable.Cell>
                  <IndexTable.Cell>{date}</IndexTable.Cell>
                  <IndexTable.Cell>{order}</IndexTable.Cell>
                  <IndexTable.Cell>{ticket}</IndexTable.Cell>
                  <IndexTable.Cell>{subsidiary}</IndexTable.Cell>
                  <IndexTable.Cell>{client}</IndexTable.Cell>
                  <IndexTable.Cell>{sku}</IndexTable.Cell>
                  <IndexTable.Cell>
                      <Text as="span" alignment="end">
                          {quantity}
                      </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>{reason}</IndexTable.Cell>
                  <IndexTable.Cell>{status}</IndexTable.Cell>
                  <IndexTable.Cell>{creditNote}</IndexTable.Cell>
                  <IndexTable.Cell>{observations}</IndexTable.Cell>
              </IndexTable.Row>
          );
  });

  return (
      <Page title="Devoluciones" fullWidth={true}>
          <Card padding={'0'}>
              <IndexTable 
              condensed={useBreakpoints().mdOnly}
              resourceName={resourceName}
              itemCount={refund.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                  {title:'Folio'},
                  {title:'Fecha'},
                  {title:'Pedido'},
                  {title:'Ticket'},
                  {title:'Sucursal'},
                  {title:'Cliente'},
                  {title:'SKU'},
                  {title:'Cantidad'},
                  {title:'Motivo'},
                  {title:'Estatus'},
                  {title:'Nota de credito'}, 
                  {title:'Observaciones'}
              ]}
              pagination={{
                  hasNext: true,
                  onNext: () => { },
              }} 
              >
                  {rowMarkup}
              </IndexTable>
          </Card>
      </Page>
  );
}
import { 
  Page, 
  IndexTable, 
  Card, 
  Badge, 
  useIndexResourceState,
  Text,
  useBreakpoints,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { json } from "@remix-run/node";
import { getDevolutions } from '../server/Devolution.server'
import { useLoaderData, Link, useNavigate } from "@remix-run/react";


export async function loader({ request }) {
    const { admin, session } = await authenticate.admin(request);
    const devolutions = await getDevolutions(admin.graphql);

    return json({
        devolutions,
    });
}

export default function ProductRefunds() {

  const { devolutions } = useLoaderData();
  const navigate = useNavigate();

  const resourceName = {
      singular: 'Devolución',
      plural: 'Devoluciones',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(devolutions);

  const rowMarkup = devolutions.map( 
      (
          {id,status,mainReason, sucursal, explanation, ticketNumber, clientNumber, orderNumber, createdAt}
          , index
      ) => {
          return (
              <IndexTable.Row
              id={id}
              key={index}
              selected={selectedResources.includes(id)}
              position={index}
              onClick={() => { navigate(`/app/refund/${id}`) }}
              >
                  <IndexTable.Cell>
                      <Text variant="bodyMd" fontWeight="bold" as="span">
                        #{id}
                      </Text>    
                  </IndexTable.Cell>
                  <IndexTable.Cell>{createdAt}</IndexTable.Cell>
                  <IndexTable.Cell>
                    {
                        status == "Atendida" ? <Badge progress={"complete"} tone={"attention"}>{status}</Badge>:
                        status == "En Transito" ? <Badge progress={"complete"} tone={"info"}>{status}</Badge>:
                        status == "Aceptada" ? <Badge progress={"complete"} tone={"success"}>{status}</Badge>:
                        status == "Rechazada" ? <Badge progress={"complete"}>{status}</Badge>: ""
                    }
                  </IndexTable.Cell>
                  <IndexTable.Cell>{mainReason}</IndexTable.Cell>
                  <IndexTable.Cell>{orderNumber}</IndexTable.Cell>
                  <IndexTable.Cell>{ticketNumber}</IndexTable.Cell>
                  <IndexTable.Cell>{clientNumber}</IndexTable.Cell>
                  <IndexTable.Cell>{sucursal}</IndexTable.Cell>
                
              </IndexTable.Row>
          );
  });

  return (

      <Page title="Devoluciones">
          <Card padding={'0'}>
              <IndexTable 
              condensed={useBreakpoints().mdOnly}
              resourceName={resourceName}
              itemCount={devolutions.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                  {title:'Folio'},
                  {title:'Fecha'},
                  {title:'Estatus'},
                  {title:'Motivo'},
                  {title:'Pedido'},
                  {title:'Ticket'},
                  {title:'Cliente'},
                  {title:'Sucursal'}
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
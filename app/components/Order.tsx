import React from "react";
import { Card, Text, Divider } from "@shopify/polaris";

interface OrderProps {
    orderNumber: number;
    ticketNumber: number;
    clientNumber: number;
}

function Order({ orderNumber, ticketNumber, clientNumber }: OrderProps) {  
    return (
        <Card>
                        
            <Text variant="headingSm" as="h2">
                No. Pedido
            </Text>
            <Divider borderColor="transparent" borderWidth={'100'}/> 
            <Text variant="bodySm" as="p">
                {orderNumber}
            </Text>
            
            <Divider borderColor="transparent" borderWidth={'100'}/> 
            <Divider borderColor="transparent" borderWidth={'100'}/>

            <Text variant="headingSm" as="h2">
                No. Ticket
            </Text>
            <Divider borderColor="transparent" borderWidth={'100'}/> 
            <Text variant="bodySm" as="p">
                {ticketNumber}
            </Text>

            <Divider borderColor="transparent" borderWidth={'100'}/> 
            <Divider borderColor="transparent" borderWidth={'100'}/>

            <Text variant="headingSm" as="h2">
                No. Cliente
            </Text>
            <Divider borderColor="transparent" borderWidth={'100'}/> 
            <Text variant="bodySm" as="p">
                {clientNumber}
            </Text>
        </Card>
    );
}

export default Order;
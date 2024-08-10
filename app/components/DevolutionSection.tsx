import React from 'react';
import {Box, Card, Text, Divider, RadioButton, BlockStack, DropZone, Thumbnail, InlineStack} from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

function DevolutionSection() {

  const [optionValue , setOptionValue] = React.useState('shipping');
  const handleChange = useCallback(
    (_: boolean, newValue: string) => setOptionValue(newValue),
    []
  );

  // File management
  const validImageTypes = ['application/pdf'];
  const [file, setFile] = useState<File>();
  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFile(acceptedFiles[0]),
    [],
  );
  const fileUpload = !file && <DropZone.FileUpload actionTitle='Subir guía' actionHint='Solo se admiten archivos .pdf'/>;
  const uploadedFile = file && (
    <div style={{display: 'grid', width: '100%', height: '100%', placeContent: 'center'}}>
        <InlineStack>
        <Thumbnail
          size="small"
          alt={file.name}
          source={ NoteIcon }
        />
        
        <div>
          {file.name} 
          <Text variant="bodySm" as="p">
            {file.size} bytes
          </Text>
        </div>
      
      </InlineStack>
    </div>
  )

  return (
    <Card roundedAbove="sm" padding={'0'}>

      <Box padding={'400'}>
        <Text as="h1" variant={'headingMd'}>
            Opciones de devolucion de envios
        </Text>
      </Box>

      <Divider/>
        
      <Box padding={'400'}>    
            <Box>
              <RadioButton
                label="Subir etiqueta de devolucion"
                helpText="Sube la etiqueta de devolucion para que el cliente pueda enviar el producto"
                checked={optionValue === 'shipping'}
                id="shipping"
                name="Shipping Label"
                onChange={handleChange}
              />

              { optionValue === 'shipping' && (
                <Box paddingBlockStart={'400'}>
                  <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
                    {uploadedFile}
                    {fileUpload}
                  </DropZone>
                </Box>
              )}
              
            </Box>  
      </Box>

      <Divider/>

      <Box padding={'400'}>    
            <Box>
              <RadioButton
                label="No se requiere envio"
                helpText="La entrega del producto se hara en sucursal"
                checked={optionValue === 'noShipping'}
                id="noShipping"
                name="Shipping Label"
                onChange={handleChange}
              />
            </Box>  
      </Box>
      

    </Card>
  );
}

export default DevolutionSection;
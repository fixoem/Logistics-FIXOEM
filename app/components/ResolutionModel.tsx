import React from "react";
import { Modal, TextField, Box, DropZone, Thumbnail, Button, InlineStack, Text, Banner, List, Divider, RadioButton } from "@shopify/polaris";
import { useState, useCallback } from "react";

function ResolutionModal() {

    const [isAccepted , setIsAccepted] = React.useState<boolean>(true);
    const handleChange = useCallback(
        (_: boolean, newValue: boolean) => setIsAccepted(newValue),
        []
    );

    const [creditNoteText, setCreditNoteText] = useState<string>("");
    const handleCreditNoteText = useCallback((value : string) => setCreditNoteText(value), []);

    const [commentariesText, setCommentariesText] = useState<string>("")
    const handleCommentariesText = useCallback((value : string) => setCommentariesText(value), []);

    const [files, setFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);
    const hasError = rejectedFiles.length > 0;

    const handleDropZoneDrop = useCallback(
        (_droppedFiles: File[], acceptedFiles: File[], rejectedFiles: File[]) => {
          setFiles((files) => [...files, ...acceptedFiles]);
          setRejectedFiles(rejectedFiles);
        },
        [],
    );

    const fileUpload = !files.length && <DropZone.FileUpload actionTitle="Cargar Imagenes" actionHint="Accepts .gif, .jpg, and .png" />;
    const uploadedFiles = files.length > 0 && (
        <InlineStack>
        {files.map((file, index) => (
            <InlineStack key={index}>
            <Thumbnail
                size="small"
                alt={file.name}
                source={window.URL.createObjectURL(file)}
            />
            <div>
                {file.name}{' '}
                <Text variant="bodySm" as="p">
                {file.size} bytes
                </Text>
            </div>
            </InlineStack>
        ))}
        </InlineStack>
    );
    const errorMessage = hasError && (
        <Banner title="The following images couldn’t be uploaded:" tone="critical">
          <List type="bullet">
            {rejectedFiles.map((file, index) => (
              <List.Item key={index}>
                {`"${file.name}" is not supported. File type must be .jpg, .png.`}
              </List.Item>
            ))}
          </List>
        </Banner>
    );

    return(
        <Modal
            open={}
            onClose={}
            title="Cargar imagenes"
            primaryAction={{
                content: "Submit",
                onAction: () => {
                
                },
            }}
            secondaryActions={[
                {
                content: "Cancel",
                onAction: () => {  },
                },
            ]}
            >

            <Modal.Section>
                <Box padding={'400'}>
       
                    <Box>
                        <Box>
                            <RadioButton
                                label="Subir etiqueta de devolucion"
                                helpText="Sube la etiqueta de devolucion para que el cliente pueda enviar el producto"
                                checked={optionValue === 'shipping'}
                                id="shipping"
                                name="Shipping Label"
                                onChange={handleChange}
                            />

                            { isAccepted && (
                                <TextField
                                    label="Nota de Credito"
                                    value={creditNoteText}
                                    onChange={handleCreditNoteText}
                                    autoComplete="off"
                                />
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

                    

                    { !isAccepted && (
                        <>
                            <TextField
                                label="Comentarios"
                                value={commentariesText}
                                multiline={6}
                                onChange={handleCommentariesText}
                                autoComplete="off"
                            />

                            <Box>
                                {errorMessage}
                                <DropZone label="Imagenes" accept="image/*" type="image" onDrop={handleDropZoneDrop}>
                                    {uploadedFiles}
                                    {fileUpload}
                                </DropZone>
                            </Box>
                        </>
                    )}

                </Box>
            </Modal.Section>
        </Modal>
    );
}

export default ResolutionModal;
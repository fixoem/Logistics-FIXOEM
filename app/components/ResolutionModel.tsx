import React from "react";
import { Modal, TextField, Box, DropZone, Thumbnail, Button, InlineStack, Text, Banner, List, Divider, RadioButton } from "@shopify/polaris";
import { useState, useCallback } from "react";

/**
 * Limpiar datos cuando se cancela
 * Enviar datos a la bd cuando se guarda
 * Obtener datos de la bd y mostrar datos si existen
*/

function ResolutionModal({ show, toggleModal }) {

    const [option , setOption] = React.useState('denied');
    const handleChange = useCallback(
        (_: boolean, newValue: string) => {setOption(newValue); console.log(newValue)},
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
            open={show}
            onClose={toggleModal}
            title="Resolucion"
            primaryAction={{
                content: "Submit",
                onAction: () => {
                    
                },
            }}
            secondaryActions={[
                {
                content: "Cancel",
                onAction: () => { 
                    toggleModal()
                },
                },
            ]}
            >

            <Modal.Section>
                <Box padding={'400'}>
       
                    <Box borderStartEndRadius={'200'}>
                        <Box>
                            <RadioButton
                                label="Aceptar Devolución"
                                checked={option === 'accept'}
                                id="acceptDevolution"
                                name="Accept Label"
                                onChange={() => handleChange(true, "accept")}
                            />

                            { option == 'accept' && (
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

                    <Box borderStartEndRadius={'200'}>    
                        <Box>
                            <RadioButton
                                label="Rechazar Devolución"
                                checked={option === 'denied'}
                                id="deniedDevolution"
                                name="Denied Label"
                                onChange={() => handleChange(true, "denied")}
                            />
                        </Box>  
                    </Box>

                    

                    { option == 'denied' && (
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
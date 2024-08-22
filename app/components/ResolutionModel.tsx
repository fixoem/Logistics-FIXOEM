import React from "react";
import { Modal, TextField, Box, DropZone, Thumbnail, Button, InlineStack, Text, Banner, List, Divider, RadioButton } from "@shopify/polaris";
import { useState, useCallback } from "react";

/**
 * Limpiar datos cuando se cancela
 * Enviar datos a la bd cuando se guarda
 * Obtener datos de la bd y mostrar datos si existen
*/

function ResolutionModal({ 
    show, 
    toggleModal, 
    saveInfo,
    resolution,
    creditNote,
    commentaries,
    resolutionHandler,
    creditNoteHandler,
    commentariesHandler,
    files,
    dropZoneHandler,
    messageError

}) {

    const fileUpload = !files.length && <DropZone.FileUpload actionTitle="Cargar Imagenes" actionHint="Accepts .jpg, and .png" />;
    const uploadedFiles = files.length > 0 && (
        <div style={{display: 'grid', width: '100%', height: '100%', placeContent: 'center'}}>
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
        </div>
    );

    return(
        <Modal
            open={show}
            onClose={toggleModal}
            title="Resolucion"
            primaryAction={{
                content: "Submit",
                onAction: () => {
                    saveInfo()
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
                                checked={resolution === 'accept'}
                                id="acceptDevolution"
                                name="Accept Label"
                                onChange={() => resolutionHandler(true, "accept")}
                            />

                            { resolution == 'accept' && (
                                <TextField
                                    label="Nota de Credito"
                                    value={creditNote}
                                    onChange={creditNoteHandler}
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
                                checked={resolution === 'denied'}
                                id="deniedDevolution"
                                name="Denied Label"
                                onChange={() => resolutionHandler(true, "denied")}
                            />
                        </Box>  
                    </Box>

                    

                    { resolution == 'denied' && (
                        <>
                            <TextField
                                label="Comentarios"
                                value={commentaries}
                                multiline={6}
                                onChange={commentariesHandler}
                                autoComplete="off"
                            />

                            <Box>
                                {messageError}
                                <DropZone label="Imagenes" accept="image/*" type="image" onDrop={dropZoneHandler}>
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
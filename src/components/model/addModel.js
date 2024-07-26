import { Form,Modal,Button, FormGroup, Input, Label, ModalBody } from "reactstrap";
 
const  AddModel=({isOpen,toggle,handleSubmit,title,fields,handleChange})=>{
    return(
        <>
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    {fields.map((field)=>(
                        <FormGroup key={field.name}>
                            <Label for={field.name}>{field.Label}</Label>
                            <Input
                            type={field.type}
                            name={field.name}
                            value={field.value}
                            onChange={handleChange}/>

                        </FormGroup>
                    ))}
                    <Button type="submit">Submit</Button>
                   
                </Form>
            </ModalBody>
        </Modal>
        </>
    )
}
export default AddModel;


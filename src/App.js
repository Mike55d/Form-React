import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Loader } from '@progress/kendo-react-indicators';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

const countries = [
  { text: 'Seleccione un pais', id: 0 },
  { text: 'Venezuela', id: 1 },
  { text: 'Bolivia', id: 2 },
  { text: 'Argentina', id: 3 },
  { text: 'Mexico', id: 4 }
];

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value) => (emailRegex.test(value) ? "" : "Email Invalido");
const inputValidator = (value) => (value ? null : "Campo requerido");

const EmailInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {
        visited && validationMessage &&
        (<Error>{validationMessage}</Error>)
      }
    </div>
  );
};

const ValidatedInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {
        visited && validationMessage &&
        (<Error>{validationMessage}</Error>)
      }
    </div>
  );
};

function App() {

  const [clienteForm, setClienteForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    ciudad: '',
    pais: '',
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showSucessDialog, setSucessShowDialog] = useState(false);

  const sendForm = () => {
    console.log('sending form');
    console.log(clienteForm);
    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
      setSucessShowDialog(true);
    }, 2500);
  }

  return (
    <div className="App">
      <Dialog className="blue" style={{ display: showDialog ? 'flex' : 'none'}} onClose={() => setShowDialog(false)}>
        <Loader size='large' type="infinite-spinner" />
      </Dialog>
      <Dialog  style={{ display: showSucessDialog ? 'flex' : 'none' }} title={"Guardado exitoso :D"} onClose={() => setSucessShowDialog(false)}>
        <p style={{ margin: "25px", textAlign: "center"}}>El formulario se ah guardado correctamente.</p>
        <DialogActionsBar>
          <button className="k-button" onClick={() => setSucessShowDialog(false)}>Ok</button>
        </DialogActionsBar>
      </Dialog>
      <Form
        onSubmit={(form) => sendForm()}
        render={(formRenderProps) => (
          <FormElement style={{ flex: 0.25, backgroundColor: '#f6f5f5', padding: 20, borderRadius: 10 }}>
            <fieldset style={{ textAlign: 'center' }} className={'k-form-fieldset'}>
              <legend className={'k-form-legend'}>Por favor rellene los campos:</legend>
              <div className="mb-3">
                <Field
                  onKeyUp={() => setClienteForm({ ...clienteForm, nombre: formRenderProps.valueGetter('nombre') })}
                  name={'nombre'} component={ValidatedInput} label={'Nombre'} validator={inputValidator}
                />
              </div>

              <div className="mb-3">
                <Field
                  onKeyUp={() => setClienteForm({ ...clienteForm, apellido: formRenderProps.valueGetter('apellido') })}
                  name={'apellido'} component={ValidatedInput} label={'Apellido'} validator={inputValidator}
                />
              </div>

              <div className="mb-3">
                <Field
                  onKeyUp={() => setClienteForm({ ...clienteForm, email: formRenderProps.valueGetter('email') })}
                  name={"email"} type={"email"} component={EmailInput} label={"Email"} validator={emailValidator}
                />
              </div>
              <div className="mb-3">
                <Field
                  onKeyUp={() => setClienteForm({ ...clienteForm, direccion: formRenderProps.valueGetter('direccion') })}
                  name={'direccion'} component={ValidatedInput} label={'Direccion'} validator={inputValidator}
                />
              </div>
              <div className="mb-3">
                <Field
                  onKeyUp={() => setClienteForm({ ...clienteForm, ciudad: formRenderProps.valueGetter('ciudad') })}
                  name={'ciudad'} component={ValidatedInput} label={'Ciudad'} validator={inputValidator}
                />
              </div>
              <div className="mb-3 mt-4">
                <DropDownList
                  defaultValue={countries[0]}
                  data={countries}
                  name="pais"
                  textField="text"
                  dataItemKey="id"
                  onChange={(obj) => setClienteForm({ ...clienteForm, pais: obj.value.id })}
                />
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <button
                type={'submit'}
                className="k-button"
                disabled={!formRenderProps.allowSubmit || !clienteForm.pais}
              >
                Guardar
            </button>
            </div>
          </FormElement>

        )}
      />
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Loader } from '@progress/kendo-react-indicators';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { ListView, ListViewHeader, ListViewFooter } from '@progress/kendo-react-listview';
import { connect } from 'react-redux';
import { addCliente, editarCliente, delCliente } from './actions/clientes';

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

const MyHeader = () => {
  return (
    <ListViewHeader style={{ color: 'rgb(160, 160, 160)', fontSize: 14 }} className='pl-3 pb-2 pt-2'>
      Lista de clientes
    </ListViewHeader>
  );
}

const MyFooter = () => {
  return (
    <ListViewFooter style={{ color: 'rgb(160, 160, 160)', fontSize: 14 }} className='pl-3 pb-2 pt-2'>
    </ListViewFooter>
  );
}

function App({ dispatch, clientes }) {

  const [clienteForm, setClienteForm] = useState({
    index: null,
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    ciudad: '',
    pais: { text: 'Seleccione un pais', id: 0 }
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showSucessDialog, setSucessShowDialog] = useState(false);
  const [accion, setAccion] = useState('nuevo');
  const formRef = useRef(null);

  const sendForm = () => {
    let newState = clientes;
    newState[clienteForm.index] = { ...clienteForm };
    console.log('sending form');
    console.log(clienteForm);
    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
      setSucessShowDialog(true);
      if (accion == 'nuevo') {
        dispatch(addCliente(clienteForm));
      } else {
        dispatch(editarCliente(newState));
      }
    }, 2500);
  }

  const newCliente = () => {
    setAccion('nuevo')
    setClienteForm({
      index: null,
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      ciudad: '',
      pais: { text: 'Seleccione un pais', id: 0 }
    });
    formRef.current.onChange('nombre', { value: '' });
    formRef.current.onChange('apellido', { value: '' });
    formRef.current.onChange('email', { value: '' });
    formRef.current.onChange('direccion', { value: '' });
    formRef.current.onChange('ciudad', { value: '' });
  }

  const editCliente = (cliente, index) => {
    setAccion('editar')
    let clienteIndex = cliente;
    clienteIndex.index = index;
    console.log(clienteIndex);
    setClienteForm(clienteIndex);
    formRef.current.onChange('nombre', { value: cliente.nombre });
    formRef.current.onChange('apellido', { value: cliente.apellido });
    formRef.current.onChange('email', { value: cliente.email });
    formRef.current.onChange('direccion', { value: cliente.direccion });
    formRef.current.onChange('ciudad', { value: cliente.ciudad });
  }

  const deleteCliente = (index) => {
    console.log('delete');
    let newState = clientes;
    newState.splice(index, 1);
    console.log(newState);
    dispatch(delCliente(newState));
  }

  const MyItemRender = props => {
    let item = props.dataItem;
    return (
      <div style={{ display: 'flex', padding: 10, alignContent: 'center', alignItems: 'center' }}>
        <div style={{ flex: 2 }}>
          <h2 style={{ fontSize: 14, color: '#454545', marginBottom: 0 }} className="text-uppercase">{item.nombre}</h2>
          <div style={{ fontSize: 12, color: "#a0a0a0" }}>{item.email}</div>
        </div>
        <div style={{ flex: 1 }}>
          <Button onClick={() => editCliente(item, props.index)} style={{ marginRight: 20 }} primary={true} >Edit</Button>
          <Button onClick={() => deleteCliente(props.index)} >Delete</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Dialog className="blue" style={{ display: showDialog ? 'flex' : 'none' }} onClose={() => setShowDialog(false)}>
        <Loader size='large' type="infinite-spinner" />
      </Dialog>
      <Dialog style={{ display: showSucessDialog ? 'flex' : 'none' }} title={"Guardado exitoso :D"} onClose={() => setSucessShowDialog(false)}>
        <p style={{ margin: "25px", textAlign: "center" }}>El formulario se ah guardado correctamente.</p>
        <DialogActionsBar>
          <button className="k-button" onClick={() => setSucessShowDialog(false)}>Ok</button>
        </DialogActionsBar>
      </Dialog>
      <Form
        ref={formRef}
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
                  value={clienteForm.pais}
                  defaultValue={countries[0]}
                  data={countries}
                  name="pais"
                  textField="text"
                  dataItemKey="id"
                  onChange={(obj) => setClienteForm({ ...clienteForm, pais: obj.value })}
                />
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <button
                type={'submit'}
                className="k-button"
                disabled={!formRenderProps.allowSubmit || !clienteForm.pais}
              >
                {accion == 'nuevo' ? 'Guardar' : 'Editar'}
              </button>
              <button
                onClick={() => newCliente()}
                style={{ marginLeft: 10 }}
                className="k-button"
              >
                Nuevo
            </button>
            </div>
          </FormElement>
        )}
      />
      <ListView
        data={clientes}
        item={MyItemRender}
        style={{ flex: .25, marginLeft: 40, padding: 20, borderRadius: 10 }}
        header={MyHeader}
        footer={MyFooter}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  clientes: state.clientes
})

export default connect(mapStateToProps)(App);

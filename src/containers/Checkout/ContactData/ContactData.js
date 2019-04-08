import React , {Component} from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from '../ContactData/ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm:{
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'zip code'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'country'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your email'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                            {value: 'Fastest', displayValue: 'Fastest'},
                            {value: 'cheapest', displayValue: 'Cheapest'},
                            {value: 'YML', displayValue: 'YML'}
                        ]
                },
                value: ''
            }
        },
        loading: false,
    }


    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then((response) => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch((error) => {
                this.setState({loading: false});
                console.log(error);
            });
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = { ...updatedOrderForm[inputIdentifier] }
        updatedFormElement.value = event.target.value;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        this.setState({orderForm: updatedOrderForm})
    }

    render() {
        const formsElementArray = [];
        for (let key in this.state.orderForm) {
            formsElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = null;
        if (this.state.loading === false) {
            form = (
                <form onSubmit={this.orderHandler}>
                    {formsElementArray.map(formElement => (
                        <Input elementType={formElement.config.elementType} elementConfig={formElement.config.elementConfig} 
                        value={formElement.config.value} key={formElement.id} changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                    ))}
                    <Button btnType='Success'>ORDER</Button>
                </form>
            )
        } else {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;
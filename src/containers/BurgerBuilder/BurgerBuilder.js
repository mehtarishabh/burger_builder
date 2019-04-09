import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get('https://burgerbuilder-e2ccc.firebaseio.com/ingredients.json')
        // .then((response) => {
        //     this.setState({
        //         ingredients: response.data
        //     });
        // })
        // .catch(error => {
        //     this.setState({error: true})
        // });
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {
        // const queryParams = [];
        // for(let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i)+ '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price='+ this.props.price);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });
        this.props.history.push('/checkout');
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients).map((key)=> {
            return ingredients[key];
        }).reduce((sum, element) => {
            return sum + element;
        }, 0)
        return sum > 0;
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = this.state.error? <p>Ingredients can't be loaded!!</p>: <Spinner />;
        if(this.props.ings) {
            burger = (
                <Fragment>
                <Burger ingredients={this.props.ings}/>
                <BuildControls ingredientAdded={this.props.onIngredientAdded} 
                ingredientRemoved={this.props.onIngredientRemoved} 
                disabled={disabledInfo}
                price= {this.props.price}
                purchasable= {this.updatePurchaseState(this.props.ings)}
                ordered={this.purchaseHandler}/>
                </Fragment>
            );
            orderSummary = <OrderSummary purchasing={this.state.purchasing} 
            ingredients={this.props.ings}
            purchaseContinued={this.purchaseContinueHandler}
            purchaseCancelled={this.purchaseCancelHandler}
            price= {this.props.price} />
        }
        if(this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Fragment>
            <Modal 
                show={this.state.purchasing} 
                modalClosed={this.purchaseCancelHandler} >
            {orderSummary}
            </Modal>
            {burger}
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));
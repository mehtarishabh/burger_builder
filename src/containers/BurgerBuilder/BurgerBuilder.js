import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions  from '../../store/actions/index';

class BurgerBuilder extends Component {
    state = {
        purchasing: false
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
        this.props.onInitIngredients();
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
        this.props.onInitPurchase();
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
        let burger = this.props.error? <p>Ingredients can't be loaded!!</p>: <Spinner />;
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
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));
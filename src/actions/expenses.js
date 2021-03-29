import database from '../firebase/firebase';
import moment from 'moment';

export const addState = (expense) => ({
    type: 'ADD_EXPENSE',
    expense
});

export const addStartState = (expenseData = {}) => { // custom middleware pour ajouter nouvelle fonction a appeler pour ajouter une data a redux store
    return (dispatch) => { // retourne une fonction avec dispatch
        const {
            description = '',
            square = 0,
            price = 0,
            createdAt = 1000
        } = expenseData;

        const expense = { description, square, price, createdAt };

        return database.ref('expenses').push(expense).then((ref) => {
            dispatch(addState({
                id: ref.key,
                ...expense
            }));
        });
    };
};

export const editState = (id, updates) => (
    {
        type: 'EDIT_EXPENSE',
        id,
        updates
    }
);

export const startEditState = (id, updates) => {
    return (dispatch) => {
        return database.ref(`expenses/${id}`).update(JSON.parse(JSON.stringify(updates))).then(() => {
            dispatch(editState(id, updates));
        }).catch((e) => {
            console.log(e);
        });
    };
};

export const setStates = (expenses) => (
    {
        type: 'SET_STATES',
        expenses
    }
);

export const setStartStates = () => {
    return (dispatch) => {
        return database.ref('expenses').once('value').then((snapshot) => {
            const tabExpenses = [];

            snapshot.forEach(expense => {
                tabExpenses.push({
                    id: expense.key,
                    ...expense.val()
                })
            });
            dispatch(setStates(tabExpenses));
        });
    }
};

export const removeState = ({ id } = {} /* set valeur default mais rend obligatoire l'argument*/) => (
    {
        type: 'REMOVE_EXPENSE',
        id
    }
);

export const removeStartState = ({ id } = {}) => {
    return (dispatch) => {
        // connect to firebase and remove document
        return database.ref(`expenses/${id}`).remove().then(() => {
            // remove data from id
            dispatch(removeState({ id }));
        })
    }
};
import { GridActions, GridActionTypes } from './actions';
import { GridState } from './state';

export const gridState = new GridState();

export default (state = gridState, action: GridActions): GridState => {
    switch (action.type) {
        case GridActionTypes.ABRIR_CONFIGURAR_COLUNA:
            {
                return {
                    ...state,
                    openColumnsConfig: true,
                };
            };
        case GridActionTypes.FECHAR_CONFIGURAR_COLUNA:
            {
                return {
                    ...state,
                    openColumnsConfig: false,
                };
            };


        default: {
            return state;
        }
    }
};
import {Grid, InputAdornment, TextField} from "@mui/material";
import React from "react";
import {NumericFormat} from "react-number-format";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export function ItemExpenseDetail(props) {
    const {item,index,updateListExpenseDetail}= props
    const handleUpdateName = (name) => {
        let convert = {...item,name:name}
        updateListExpenseDetail(convert,index)
    }
    const handleUpdateAmount = (value) => {
        let convert = {...item,amount:value}
        updateListExpenseDetail(convert,index)
    }
    const handleUpdateDescription= (value) => {
        let convert = {...item,description:value}
        updateListExpenseDetail(convert,index)
    }
    return (
        <Grid item={true} md={6}>
            <div className={'item-expense-detail'}>
                <div style={{marginRight:'5px',marginTop:'13px'}}>
                    <h4>{index+1}</h4>
                </div>
                <div className={'item-expense-detail-component'}>
                    <div className={'label-input'}>Tên chi phí</div>
                    <TextField
                        size={"small"}
                        id='name'
                        name='name'
                        className={'formik-input'}
                        // variant="standard"
                        value={item.name}
                        onChange={(e)=>{handleUpdateName(e.target.value)}}
                        // error={touched.name && Boolean(errors.name)}
                        // helperText={touched.name && errors.name}

                    />
                </div>
                <div className={'item-expense-detail-component'}>
                    <div className={'label-input'}>Số tiền
                        <span className={'error-message'}>*</span></div>
                    <NumericFormat
                        id='amount'
                        name='amount'
                        className={'formik-input text-right'}
                        size={"small"}
                        value={item.amount}
                        customInput={TextField}
                        // error={touched.amount && Boolean(errors.amount)}
                        // helperText={touched.amount && errors.amount}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                        }}
                        thousandSeparator={"."}
                        decimalSeparator={","}
                        onValueChange={(values) => {
                            const {formattedValue, value, floatValue} = values;
                            const re = /^[0-9\b]+$/;
                            if (re.test(floatValue)) {
                                handleUpdateAmount(floatValue)
                                // setFieldValue('amount', floatValue)
                            }
                        }}
                    />
                </div>
                <div className={'item-expense-detail-component'}>
                    <div className={'label-input'}>Ghi chú</div>
                    <TextField
                        size={"small"}

                        className={'formik-input'}
                        // variant="standard"
                        id='description'
                        name='description'
                        // multiline
                        // rows={5}
                        value={item.description}
                        onChange={(e)=>{handleUpdateDescription(e.target.value)}}
                        // error={touched.description && Boolean(errors.description)}
                        // helperText={touched.description && errors.description}

                    />
                </div>
                <div className={'item-expense-detail-component'}>
                    <DeleteOutlineIcon
                        style={{cursor: "pointer",marginTop:'15px'}}
                        color={"error"}
                        onClick={() => {
                            updateListExpenseDetail(null,index)
                        }}></DeleteOutlineIcon>
                </div>
            </div>
        </Grid>

    )
}
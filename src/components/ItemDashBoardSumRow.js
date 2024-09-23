import React, {useEffect, useState} from "react";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {Divider} from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ShareIcon from '@mui/icons-material/Share';
import BusinessIcon from '@mui/icons-material/Business';
export default function ItemDashBoardSumRow(props) {
    const { item,icon} = props

    return (
        <div className={'item-dashboard-sum-detail-row'}>
            <div style={{display:'flex',alignItems:'center'}}>
                {
                    icon?icon=='serviceGroup'?<DragIndicatorIcon style={{color:'#a3aed0',marginRight:'5px'}}></DragIndicatorIcon>:icon=='under'?<ShareIcon style={{color:'#a3aed0',marginRight:'5px'}}></ShareIcon>:icon=='company'?<BusinessIcon style={{color:'#a3aed0',marginRight:'5px'}}></BusinessIcon>:'':''
                }
                <div className={'item-dashboard-sum-detail-row-tittle'}>
                    {item.title}
                </div>
            </div>

            <div className={`item-dashboard-sum-detail-row-value`} style={{color:item.color}}>
                {item.value}
            </div>
        </div>
    )
}
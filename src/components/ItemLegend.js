import React from "react";


export default function ItemLegend(props) {
    const {item} = props;


    return (
        <div className={'item-legend'}>
            {
                item.optimal? <></>: <div className={'item-legend-value'} style={{color:item.color}}>
                    {item.value}
                </div>
            }

            <div className={'item-legend-label'}>
                {item.label}
            </div>
        </div>
    );
}
import React, {useEffect, useState} from "react";
import {ArcElement, Chart as ChartJS, Colors, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export default function ItemTicketPie(props) {
    const {title,list,sum,type} = props;
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng',
                sum: 0,
                data: [0],
                hoverOffset: 4,
            },
        ],
    })
    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, options) {
            const {ctx, data} = chart;
            ctx.save();
            ctx.font = 'bold 20px Arial'
            ctx.textAlign = 'center';
            ctx.textBaseline = "middle";
            ctx.fillStyle = '#2566e9';
            ctx.fillText(data.datasets[0].sum, chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y)
        }
    }
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        rotation: (0.5 * Math.PI),
        plugins: {
            legend: {
                display: true,
                position: 'left',
                labels: {
                    // boxWidth: 36,
                    // padding: 20,
                    font: {
                        size: 13
                    },
                },
            },
            colors: {
                forceOverride: true,
            }
        }
    };
    useEffect(() => {
        if(list.length>0){
            let labels = []
            let datas = [];
            for (let i = 0; i < list.length;i++){
                labels.push(`${list[i].name||list[i].label}: ${list[i].value} (${((list[i].value/sum) * 100).toFixed(2)}%)`)
                datas.push(list[i].value);
            }
            let datasets = [...data.datasets]
            datasets[0].data = datas;
            datasets[0].sum = sum;
            setData({...data, labels: labels, datasets: datasets})
        }
    }, [props])

    return (
        <div className={'item-dashboard-pie-chart'}>
            <div className={`item-dashboard-body ${type=='ict'?'ict':''}`}>
                <Doughnut plugins={[textCenter]} height="230" width="230" options={options} data={data}/>
            </div>
        </div>
    );
}
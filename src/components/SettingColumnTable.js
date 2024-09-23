import React, {useEffect, useState} from "react";
import {Button, Divider, Switch} from "@mui/material";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import apiTableConfig from "../api/tableConfig";
export default function SettingColumnTable(props) {
    const {columns,isRefreshConfigTable,setIsRefreshConfigTable,nameTable} = props;
    const [listColumn, setListColumn] = useState([])
    const [tableName, setTableName] = useState()
    const handleDragEnd = (result) => {
        if (!result.destination) return; // Không có vị trí đích

        const {source, destination} = result;

        // Sao chép danh sách gốc
        const newItems = [...listColumn];

        // Di chuyển thẻ đến vị trí mới
        const [removed] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, removed);

        // Cập nhật danh sách mới
        setListColumn(newItems);
    };
    const changeSettingColumn = (index,value) => {
        setListColumn([...listColumn.slice(0,index),{...listColumn[index],visible:value},...listColumn.slice(index+1)])
    }
    useEffect(() => {
        setListColumn(columns)
    }, [columns])
    useEffect(() => {
        setTableName(nameTable)
    }, [nameTable])
    useEffect(() => {
        console.log("listColumn", listColumn)
    }, [listColumn])
    const submitUpdate = () => {
      let request = [...listColumn];
      for (let i=0;i<request.length;i++){
          request[i].index = i;
      }
      updateConfigTableApi(listColumn,tableName).then(r=>{
          setIsRefreshConfigTable(!isRefreshConfigTable)
      })
    }
    const submitDefault = () => {
        defaultConfigTableApi(tableName).then(r=>{
            setIsRefreshConfigTable(!isRefreshConfigTable)
        })
    }
    const updateConfigTableApi = (data,tableName) => {
      return apiTableConfig.update(data,tableName);
    }
    const defaultConfigTableApi = (tableName) => {
        return apiTableConfig.default(tableName);
    }
    return (
        <div className={'wrapper-setting-table'}>
            <div className={'table-content-title'} style={{marginBottom: '5px'}}>
                Danh sách cột
            </div>
            <Divider/>
            <div style={{overflowY:'auto',height:'310px'}}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{listStyleType: 'none'}}
                            >
                                {listColumn.map((item, index) => (
                                    <Draggable key={item.name} draggableId={item.name} index={index}>
                                        {(provided) => (
                                            <div className={'item-setting-table'} ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}
                                                 style={{...provided.draggableProps.style}}>
                                                <div className={'flex'}>
                                                    <div style={{marginRight: '10px'}}>
                                                        <Switch
                                                            size="small"
                                                            checked={item.visible}
                                                            onChange={(event) => {
                                                                changeSettingColumn(index, event.target.checked)
                                                                // handleChangeActiveUser(item.id,!item.isActive);
                                                            }}
                                                            inputProps={{'aria-label': 'controlled'}}/>
                                                    </div>
                                                    <div>
                                                        {
                                                            item.name
                                                        }
                                                    </div>
                                                </div>

                                                <div>
                                                    <DragIndicatorIcon style={{cursor:'grab'}}></DragIndicatorIcon>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <Divider/>

            <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'10px'}}>
                <Button onClick={()=>{submitDefault()}}  variant={'outlined'} color={"primary"}>Mặc định</Button>
                <Button style={{marginLeft:"5px"}}  onClick={()=>{submitUpdate()}} variant={'outlined'} color={"primary"}>Lưu</Button>
            </div>
        </div>
    );
}
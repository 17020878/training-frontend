import {Autocomplete, Checkbox, FormControl, Grid, MenuItem, Select, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {
    deleteAllIdSame,
    expenseByStudentObject,
    getListMonth,
    getListObjectBykey,
    getListStatusStudentByAttendance,
    getListYear,
    getTrainingTypesPutInTraining,
    typeDashboardStatistical
} from "../../constants/utils";
import {useSelector} from "react-redux";
import ItemPie from "../../components/ItemPie";
import ItemBar from "../../components/ItemBar";
import apiTraining from "../../api/training";
import apiPlan from "../../api/plan";
import apiAttendance from "../../api/attendance";
import apiTrainingClass from "../../api/training-class";
import apiCategory from "../../api/category";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function DashboardPage() {
    const [timeSearch, setTimeSearch] = useState('2024-01-01/2024-12-31');
    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;
    const currentUser = useSelector(state => state.currentUser)
    const [isRefresh, setIsRefresh] = useState(false)
    const [allTrainings, setAllTrainings] = useState([]);
    const [trainingIds, setTrainingIds] = useState([]);
    const [lecturerObjectsStatistical, setLecturerObjectsStatistical] = useState([]);
    const [totalLecturerObjectsStatistical, setTotalLecturerObjectsStatistical] = useState([]);
    const [formTrainingStatistical, setFormTrainingStatistical] = useState([]);
    const [totalFormTrainingStatistical, setTotalFormTrainingStatistical] = useState([]);
    const [trainingTypesStatistical, setTrainingTypesStatistical] = useState([]);
    const [totalTrainingTypesStatistical, setTotalTrainingTypesStatistical] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [listStudentStatistical, setListStudentStatistical] = useState([]);
    const [totalStatusAttendance, setTotalStatusAttendance] = useState([]);
    const [listStatusAttendanceStatistical, setListStatusAttendanceStatistical] = useState([]);
    const [expenseStatistical, setExpenseStatistical] = useState([]);
    const [listStudentsObject, setListStudentsObject] = useState([]);
    const [allStudentsObject, setAllStudentsObject] = useState([]);

//=====================================================================================================
    useEffect(() => {
        getCategoryApi({
            paging: false,
            type: "StudentObject"
        }).then(r => {
            if (r.data.responses != null) setAllStudentsObject(r.data.responses)
        })
    },[])
    useEffect(() => {

    },[listStudentsObject])
    useEffect(() => {
        getAllPlanApi().then(r => {
            setAllPlans(r.data);
        }).catch(e => {})
    },[])
    useEffect(() => {
        getAllAttendanceByTrainingApi(trainingIds).then(r => {
            setTotalStatusAttendance(getListStatusStudentByAttendance(r.data).length)
            setListStatusAttendanceStatistical(typeDashboardStatistical(getListStatusStudentByAttendance(r.data), 'name', 'label', 'value'))
            setListStudentStatistical(typeDashboardStatistical(r.data.map(({ student }) => ({
                id: student.id,
                name: student.blockOrganization.name,
            })), 'name','name', 'value'))
        }).catch(e => {})
    },[trainingIds])
    useEffect(() => {
            getAllTrainingApi().then(r => {
                setAllTrainings(r.data)
            }).catch(e => {})
    }, [isRefresh, allPlans])
    useEffect(() => {
        getAllTrainingClassByTrainingsApi(allTrainings.map(item => item.id)).then(r => {
            setExpenseStatistical(expenseByStudentObject(r.data))
        })
        setTrainingIds(allTrainings.map(item => item.id))
        let listLecturerObjects = getListObjectBykey(allTrainings,'lecturerObjects');
        let listFormTraining = getListObjectBykey(allTrainings,'formTraining');
        let listTrainingTypes = getListObjectBykey(getTrainingTypesPutInTraining(allPlans, allTrainings),'trainingTypes');

        setTotalLecturerObjectsStatistical(listLecturerObjects.length)
        setLecturerObjectsStatistical(typeDashboardStatistical(listLecturerObjects, 'name', 'label', 'value'))

        setTotalFormTrainingStatistical(listFormTraining.length)
        setFormTrainingStatistical(typeDashboardStatistical(listFormTraining, 'name','label', 'value'))

        setTotalTrainingTypesStatistical(listTrainingTypes.length)
        setTrainingTypesStatistical(typeDashboardStatistical(listTrainingTypes, 'name','label', 'value'))
    },[allTrainings])

//=====================================================================================================
    const getAllPlanApi = () => {
        return apiPlan.getAllPlan();
    }
    const getAllTrainingApi = () => {
        return apiTraining.getAllTraining();
    }
    const getAllAttendanceByTrainingApi = (ids) => {
        return apiAttendance.getAllAttendanceByTraining(ids);
    }
    const getAllTrainingClassByTrainingsApi = (trainingIds) => {
        return apiTrainingClass.getAllTrainingClassByTrainings(trainingIds);
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }
//=====================================================================================================
    return (
        <div className={'dashboard-body-group'} style={{background: "#eeeeee"}}>
            <div className={'organization-select mb-10'}>
                <div>
                    <div className={'item-dashboard-tittle'}>Xin chào {currentUser.name},</div>
                    <div className={'item-dashboard-span'}>Bạn đang xem dữ liệu tổng quan về đào tạo tại Amberholdings
                    </div>
                </div>
                <div className={'flexGroup2'}>
                    <Grid item xs={12} md={12}>
                        <div className={'label-input'}>Đối tượng học viên</div>
                        <FormControl fullWidth>
                            <Autocomplete
                                size={"small"}
                                multiple
                                id="checkboxes-tags-demo"
                                className={'multi-select-search'}
                                options={allStudentsObject}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option, {selected}) => {
                                    const {key, ...optionProps} = props;
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{marginRight: 8}}
                                                checked={listStudentsObject.filter(item => item.id === option.id).length > 0}
                                            />
                                            {option.name}
                                        </li>
                                    );
                                }}
                                value={listStudentsObject}
                                onChange={(event, values, changeReason, changeDetails) => {
                                    setListStudentsObject(deleteAllIdSame(values))
                                }}
                                renderInput={(params) => <TextField
                                    className={'multi-select-search-text'} {...params} />}
                            />
                        </FormControl>
                    </Grid>
                    <div style={{width: '100px', marginLeft: '5px'}}>
                        <FormControl fullWidth>
                            <Select
                                value={timeSearch}
                                onChange={(event) => {
                                    setTimeSearch(event.target.value);
                                }}
                                size={"small"}>
                                {
                                    getListYear().map((value) => (
                                        <MenuItem value={value.value}>{value.name}</MenuItem>

                                    ))
                                }

                            </Select>
                        </FormControl>
                    </div>
                    <div style={{width: '100px', marginLeft: '5px'}}>
                        <FormControl fullWidth>
                            <Select
                                // multiple
                                value={timeSearch}
                                onChange={(event) => {
                                    setTimeSearch(event.target.value);
                                }}
                                size={"small"}>
                                {
                                    getListMonth().map((value) => (
                                        <MenuItem value={value.value}>{value.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className={'main-content-dashboard'}>
                <div className={'wrapper-dashboard'}>
                    <Grid container spacing={1.5}>
                        <Grid container item spacing={1.5}>
                            <Grid item xs={12} container spacing={1.5}>
                                <Grid item xs={4}>
                                    <div className={'item-dashboard-data left'}>
                                        <div className={'item-dashboard-data-group'}>
                                            <div className={'item-dashboard-data-top'}>
                                                <p>Số lượt học viên tham gia đào tạo</p>
                                            </div>
                                            <div className={'item-dashboard-data-bottom'}>
                                                <p>6</p>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div className={'item-dashboard-data middle'}>
                                        <div className={'item-dashboard-data-group'}>
                                            <div className={'item-dashboard-data-top'}>
                                                <p>Số chương trình đào tạo</p>
                                            </div>
                                            <div className={'item-dashboard-data-bottom'}>
                                                <p>8</p>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div className={'item-dashboard-data right'}>
                                        <div className={'item-dashboard-data-group'}>
                                            <div className={'item-dashboard-data-top'}>
                                                <p>Tổng số giờ đào tạo</p>
                                            </div>
                                            <div className={'item-dashboard-data-bottom'}>
                                                <p>10</p>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={1.5} xs={12}>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={'item-dashboard-header'}>
                                            <div className={'item-dashboard-tittle'}>Tỉ lệ giảng viên</div>
                                        </div>
                                        <div style={{height: '38px'}}>

                                        </div>
                                        <ItemPie optimal={true} list={lecturerObjectsStatistical} title={'Tỉ lệ giảng viên'}
                                                 sum={totalLecturerObjectsStatistical}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={'item-dashboard-header'}>
                                            <div className={'item-dashboard-tittle'}>Hình thức đào tạo</div>
                                        </div>
                                        <div style={{height: '38px'}}>

                                        </div>
                                        <ItemPie optimal={true} list={formTrainingStatistical} title={'Hình thức đào tạo'}
                                                 sum={totalFormTrainingStatistical}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={'item-dashboard-header'}>
                                            <div className={'item-dashboard-tittle'}>Loại khóa đào tạo</div>
                                        </div>
                                        <div style={{height: '38px'}}>

                                        </div>
                                        <ItemPie optimal={true} list={trainingTypesStatistical} title={'Loại khóa đào tạo'}
                                                 sum={totalTrainingTypesStatistical}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div style={{overflowY: 'auto'}}>
                                        <ItemBar list={listStudentStatistical} title={'Số lượt học viên tham gia đào tạo (lượt)'}/>
                                    </div>

                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={'item-dashboard-header'}>
                                            <div className={'item-dashboard-tittle'}>Tỉ lệ học viên hoàn thành chương trình đào tạo
                                            </div>
                                        </div>
                                        <div style={{height: '38px'}}>

                                        </div>
                                        <ItemPie optimal={true} list={listStatusAttendanceStatistical} title={'Tỉ lệ học viên hoàn thành chương trình đào tạo'}
                                                 sum={totalStatusAttendance}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div style={{overflowY: 'auto'}}>
                                        <ItemBar list={expenseStatistical} title={'Chi phí đào tạo (Triệu đồng)'}/>
                                    </div>

                                </div>
                            </Grid>
                            {/*<Grid item xs={6}>*/}
                            {/*    <div style={{overflowY: 'auto'}}>*/}
                            {/*        <div style={{overflowY: 'auto'}}>*/}
                            {/*            <ItemBar list={listExpenseMonth} title={'Tỉ lệ giảng viên'}/>*/}
                            {/*        </div>*/}

                            {/*    </div>*/}
                            {/*</Grid>*/}
                            {/*<Grid item xs={6}>*/}
                            {/*    <div className={'item-dashboard-sum'} style={{position: "relative"}}>*/}
                            {/*        <div className={'item-dashboard-sum-header'}>*/}
                            {/*            <div className={'item-dashboard-tittle'}>*/}
                            {/*                Chi phí theo kế hoạch*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        <div className={'item-dashboard-sum-total'}>*/}
                            {/*            {currencyFormatter(totalAmountExpense) + " VNĐ"}<Divider></Divider>*/}
                            {/*        </div>*/}
                            {/*        <div className={'item-dashboard-sum-detail'}>*/}
                            {/*            <div*/}
                            {/*                className={`message-table-empty ${listExpensePlan.length == 0 ? 'mt-30' : 'hidden'}`}>Không*/}
                            {/*                có dữ liệu*/}
                            {/*            </div>*/}
                            {/*            {*/}
                            {/*                listExpensePlan.map((item) => (*/}
                            {/*                    <ItemDashBoardSumRow*/}
                            {/*                        item={{*/}
                            {/*                            title: item.name,*/}
                            {/*                            value: currencyFormatter(item.amount) + " VNĐ",*/}
                            {/*                            color: '#00a9f2'*/}
                            {/*                        }}></ItemDashBoardSumRow>*/}
                            {/*                ))*/}
                            {/*            }*/}


                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</Grid>*/}
                            {/*<Grid item xs={6}>*/}
                            {/*    <div style={{overflowY: 'auto'}}>*/}
                            {/*        <div className={'item-dashboard-pie-chart'}>*/}
                            {/*            <div className={'item-dashboard-header'}>*/}
                            {/*                <div className={'item-dashboard-tittle'}>Chi phí theo nhóm</div>*/}
                            {/*            </div>*/}
                            {/*            <TreeSelect*/}
                            {/*                {...filterOptions} filterMode="strict"*/}
                            {/*                // filterMode="strict"*/}
                            {/*                value={selectedNodeKeysGroupExpense}*/}
                            {/*                onChange={(e) => {*/}
                            {/*                    setSelectedNodeKeysGroupExpense(e.value)*/}
                            {/*                }}*/}
                            {/*                options={sortTreeData(listGroupExpenseTree)}*/}
                            {/*                expandedKeys={expandedKeysGroupExpense}*/}
                            {/*                onToggle={(e) => setExpandedKeysGroupExpense(e.value)}*/}
                            {/*                style={{*/}
                            {/*                    width: '250px',*/}
                            {/*                    marginTop: '5px',*/}
                            {/*                    zIndex: '1000000 !important',*/}
                            {/*                    overflow: 'auto'*/}
                            {/*                }}*/}
                            {/*                className="md:w-20rem w-full"*/}
                            {/*                placeholder="Nhóm chi phí"></TreeSelect>*/}
                            {/*            <ItemPie optimal={true} list={listGroupExpensePie} title={'Chi phí theo đơn vị'}*/}
                            {/*                     sum={totalGroupExpensePie}/>*/}
                            {/*        </div>*/}

                            {/*    </div>*/}
                            {/*</Grid>*/}


                        </Grid>
                    </Grid>

                </div>
            </div>
        </div>
    )
}
import {Autocomplete, Checkbox, FormControl, Grid, MenuItem, Select, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {
    deleteAllIdSame,
    getFormTrainingPutInTrainingClass,
    getListMonth,
    getListObjectBykey,
    getListStatusStudentByAttendance,
    getListYear,
    getTrainingTypesPutInTraining,
    totalExpenseByStudentObject,
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
    //const [trainingIds, setTrainingIds] = useState([]);
    const [trainingClassIds, setTrainingClassIds] = useState([]);
    const [lecturerObjectsStatistical, setLecturerObjectsStatistical] = useState([]);
    const [totalLecturerObjectsStatistical, setTotalLecturerObjectsStatistical] = useState([]);
    const [studentObjectsStatistical, setStudentObjectsStatistical] = useState([]);
    const [totalStudentObjectsStatistical, setTotalStudentObjectsStatistical] = useState([]);
    const [formTrainingStatistical, setFormTrainingStatistical] = useState([]);
    const [totalFormTrainingStatistical, setTotalFormTrainingStatistical] = useState([]);
    const [trainingTypesStatistical, setTrainingTypesStatistical] = useState([]);
    const [totalTrainingTypesStatistical, setTotalTrainingTypesStatistical] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [allTrainingClass, setAllTrainingClass] = useState([]);
    const [allTrainingClassDefault, setAllTrainingClassDefault] = useState([]);
    const [listExpenseStudentObjectStatistical, setListExpenseStudentObjectStatistical] = useState([]);
    const [listStudentStatistical, setListStudentStatistical] = useState([]);
    const [totalStatusAttendance, setTotalStatusAttendance] = useState([]);
    const [listStatusAttendanceStatistical, setListStatusAttendanceStatistical] = useState([]);
    const [year, setYear] = useState(0);
    const [listMonths, setListMonths] = useState([]);

//=====================================================================================================
    useEffect(() => {
        getAllPlanApi().then(r => {
            setAllPlans(r.data);
        }).catch(e => {})
    },[])
    useEffect(() => {
        getAllTrainingClass().then(r => {
            setAllTrainingClassDefault(r.data);
            setAllTrainingClass(r.data)
        }).catch(e => {})
    },[])
    useEffect(() => {
        if(year !== 0){
            // console.log(allTrainingClass.filter(item => {
            //     const date = new Date(item.endDate);
            //     const isSameYear = date.getFullYear() === parseInt(year);
            //     const isMonthSelected = listMonths.length === 0 || listMonths.some(month => month.value === date.getMonth() + 1);
            //     return isSameYear && isMonthSelected;
            // }))
            setAllTrainingClass(allTrainingClassDefault.filter(item => {
                const date = new Date(item.endDate);
                const isSameYear = date.getFullYear() === parseInt(year);
                const isMonthSelected = listMonths.length === 0 || listMonths.some(month => month.value === date.getMonth() + 1);
                return isSameYear && isMonthSelected;
            }))
        }
    },[listMonths,year])
    console.log(allTrainingClass)
    useEffect(() => {
        getAllTrainingApi().then(r => {
            setAllTrainings(r.data)
        }).catch(e => {})
    }, [isRefresh, allPlans])
    useEffect(() => {
        getAllAttendanceByTrainingClassApi(allTrainingClass.map(item => item.id)).then(r => {
            setTotalStatusAttendance(getListStatusStudentByAttendance(r.data).length)
            setListStatusAttendanceStatistical(typeDashboardStatistical(getListStatusStudentByAttendance(r.data), 'name', 'label', 'value'))
            setListStudentStatistical(typeDashboardStatistical(r.data.filter(student => student.statusId !== 3 && student.statusId !== 6).map(({ student }) => ({
                id: student.id,
                name: student.blockOrganization.name,
            })), 'name','name', 'value'))
            setListExpenseStudentObjectStatistical(totalExpenseByStudentObject(r.data))
        }).catch(e => {})


        let allTrainingHavePlan = getTrainingTypesPutInTraining(allPlans, allTrainings);
        let allTrainingClassHaveTrainingTypesAndFormTraining = getFormTrainingPutInTrainingClass(allTrainingHavePlan, allTrainingClass)
        let listLecturerObjects = getListObjectBykey(allTrainingClass,'lecturerObjects');
        let listStudentObjects = getListObjectBykey(allTrainingClass,'studentObjects');
        let listFormTraining = getListObjectBykey(allTrainingClassHaveTrainingTypesAndFormTraining,'formTraining');
        let listTrainingTypes = getListObjectBykey(allTrainingClassHaveTrainingTypesAndFormTraining,'trainingTypes');

        setTotalLecturerObjectsStatistical(listLecturerObjects.length)
        setLecturerObjectsStatistical(typeDashboardStatistical(listLecturerObjects, 'name', 'label', 'value'))

        setTotalStudentObjectsStatistical(listStudentObjects.length)
        setStudentObjectsStatistical(typeDashboardStatistical(listStudentObjects, 'name', 'label', 'value'))

        setTotalFormTrainingStatistical(listFormTraining.length)
        setFormTrainingStatistical(typeDashboardStatistical(listFormTraining, 'name','label', 'value'))

        setTotalTrainingTypesStatistical(listTrainingTypes.length)
        setTrainingTypesStatistical(typeDashboardStatistical(listTrainingTypes, 'name','label', 'value'))
    },[allTrainingClass])


//=====================================================================================================
    const getAllPlanApi = () => {
        return apiPlan.getAllPlan();
    }
    const getAllTrainingClass = () => {
        return apiTrainingClass.getAllTrainingClass();
    }
    const getAllTrainingApi = () => {
        return apiTraining.getAllTraining();
    }
    // const getAllAttendanceByTrainingApi = (ids) => {
    //     return apiAttendance.getAllAttendanceByTraining(ids);
    // }
    const getAllAttendanceByTrainingClassApi = (ids) => {
        return apiAttendance.getAllAttendanceByTrainingClass(ids);
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
                    <div style={{width: '150px', marginLeft: '5px'}}>
                        <div className={'label-input'}>Theo năm</div>
                        <FormControl fullWidth>
                            <Select
                                value={year}
                                onChange={(event) => {
                                    setYear(event.target.value);
                                    setListMonths([])
                                }}
                                size={"small"}>
                                <MenuItem value={0}>Tất cả</MenuItem>
                                {
                                    getListYear().map((value) => (
                                        <MenuItem value={value.value}>{value.name}</MenuItem>

                                    ))
                                }

                            </Select>
                        </FormControl>
                    </div>
                    {/*<div style={{width: '150px', marginLeft: '5px'}}>*/}
                    {/*    <div className={'label-input'}>Theo tháng</div>*/}
                    {/*    <FormControl fullWidth>*/}
                    {/*        <Select*/}
                    {/*            value={month}*/}
                    {/*            onChange={(event) => {*/}
                    {/*                setMonth(event.target.value);*/}
                    {/*            }}*/}
                    {/*            size={"small"}>*/}
                    {/*            <MenuItem value={0}>Tất cả</MenuItem>*/}
                    {/*            {*/}
                    {/*                getListMonth().map((value) => (*/}
                    {/*                    <MenuItem value={value.value}>{value.name}</MenuItem>*/}
                    {/*                ))*/}
                    {/*            }*/}
                    {/*        </Select>*/}
                    {/*    </FormControl>*/}
                    {/*</div>*/}
                    {
                        year === 0
                        ? ''
                        : <Grid item xs={4} md={3} style={{marginLeft: '10px'}}>
                                <div className={'label-input'}>Tháng<span
                                    className={'error-message'}>*</span></div>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        size={"small"}
                                        multiple
                                        id="checkboxes-tags-demo"
                                        className={'multi-select-search'}
                                        placeholder={"Tất cả"}
                                        options={getListMonth()}
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
                                                        checked={listMonths.filter(item => item.value === option.value).length > 0}
                                                    />
                                                    {option.name}
                                                </li>
                                            );
                                        }}
                                        value={listMonths}
                                        onChange={(event, values, changeReason, changeDetails) => {
                                            if(values.length > 0){
                                                if(values[0].value === 0){
                                                    if(listMonths.length >= 12) setListMonths([])
                                                    else setListMonths(getListMonth())
                                                }else{
                                                    setListMonths(deleteAllIdSame(values, 'value'))
                                                }
                                            }else {
                                                setListMonths([])
                                            }
                                        }}
                                        renderInput={(params) => <TextField
                                            className={'multi-select-search-text'} {...params} />}
                                    />
                                </FormControl>
                            </Grid>
                    }

                </div>
            </div>
            <div className={'main-content-dashboard'}>
                <div className={'wrapper-dashboard'}>
                    <Grid container spacing={1.5}>
                        <Grid container item spacing={1.5}>
                            <Grid item xs={12} container spacing={1.5}>
                                <Grid item xs={3}>
                                    <div className={'item-dashboard-data left'}>
                                        <div className={'item-dashboard-data-group'}>
                                            <div className={'item-dashboard-data-top'}>
                                                <p>Số lượt học viên tham gia đào tạo</p>
                                            </div>
                                            <div className={'item-dashboard-data-bottom'}>
                                                <p>{listStudentStatistical.reduce((sum, item) => sum + item.value, 0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={'item-dashboard-data middle'}>
                                        <div className={'item-dashboard-data-group'}>
                                            <div className={'item-dashboard-data-top'}>
                                                <p>Số chương trình đào tạo</p>
                                            </div>
                                            <div className={'item-dashboard-data-bottom'}>
                                                <p>{new Set(allTrainingClass.map(item => item.training.id)).size}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={'item-dashboard-data right'}>
                                        <div className={'item-dashboard-data-group'}>
                                            <div className={'item-dashboard-data-top'}>
                                                <p>Tổng số giờ đào tạo</p>
                                            </div>
                                            <div className={'item-dashboard-data-bottom'}>
                                                <p>{allTrainings.reduce((sum, item) => sum + (item.totalEstimateDuration || 0), 0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={'item-dashboard-data out'}>
                                        <div className={'item-dashboard-data-group'}>
                                            <div className={'item-dashboard-data-top'}>
                                                <p>Tổng chi phí đào tạo</p>
                                            </div>
                                            <div className={'item-dashboard-data-bottom'}>
                                                <div className={'flexGroup1'}>
                                                    <p className={'mr5'}>{allTrainingClass.reduce((sum, item) => sum + (item.totalExpense || 0), 0).toLocaleString('vi-VN', {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2
                                                    })}</p>
                                                    <span className={'medium color-white'}>triệu đồng</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={1.5} xs={12}>
                            <Grid item xs={4}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={' item-dashboard-header mb10'}>
                                            <div className={'item-dashboard-tittle'}>Tỉ lệ phân loại giảng viên</div>
                                        </div>
                                        
                                        <ItemPie optimal={true} list={lecturerObjectsStatistical} title={'Tỉ lệ giảng viên'}
                                                 sum={totalLecturerObjectsStatistical}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={' item-dashboard-header mb10'}>
                                            <div className={'item-dashboard-tittle'}>Hình thức đào tạo</div>
                                        </div>
                                        
                                        <ItemPie optimal={true} list={formTrainingStatistical} title={'Hình thức đào tạo'}
                                                 sum={totalFormTrainingStatistical}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={' item-dashboard-header mb10'}>
                                            <div className={'item-dashboard-tittle'}>Tỉ lệ đối tượng tham gia đào tạo</div>
                                        </div>
                                        
                                        <ItemPie optimal={true} list={studentObjectsStatistical} title={'Tỉ lệ đối tượng tham gia đào tạo'}
                                                 sum={totalStudentObjectsStatistical}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={' item-dashboard-header mb10'}>
                                            <div className={'item-dashboard-tittle'}>Loại khóa đào tạo</div>
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
                                    <div style={{overflowY: 'auto'}}>
                                        <ItemBar list={listExpenseStudentObjectStatistical} title={'Chi phí đào tạo (Triệu đồng)'}/>
                                    </div>

                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className={'item-dashboard-pie-chart'}>
                                        <div className={' item-dashboard-header mb10'}>
                                            <div className={'item-dashboard-tittle'}>Tỉ lệ học viên hoàn thành chương trình đào tạo
                                            </div>
                                        </div>
                                        
                                        <ItemPie optimal={true} list={listStatusAttendanceStatistical} title={'Tỉ lệ học viên hoàn thành chương trình đào tạo'}
                                                 sum={totalStatusAttendance}/>
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
                            {/*            <div className={' item-dashboard-header mb10'}>*/}
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
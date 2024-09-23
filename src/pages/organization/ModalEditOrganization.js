import {
    Box,
    Button,
    Grid,
    TextField,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Form, Formik} from "formik";
import {toast} from "react-toastify";
import * as yup from 'yup';
import {TreeSelect} from "primereact/treeselect";
import apiOrganization from "../../api/organization";
import {sortTreeData} from "../../constants/utils";


const ModalEditOrganization = (props) => {
    const {updateOrganization,listOrganizationTree, isUpdate, openModalEdit, handleCloseModalEdit, isRefresh,setIsRefresh} = props;
    const [disable, setDisable] = useState(false);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState(0);
    const [expandedKeys, setExpandedKeys] = useState({0: true});

    const [info, setInfo] = useState({
        id:null,
        name: '',
        code: '',
        description: '',
        parentId: null,
    })
    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự'),
        code: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 chữ số'),
        // description: yup
        //     .string()
        //     .trim()
        //     .required('Không được để trống')
        //     .max(255, 'Tối đa 4000 ký tự'),


    });
    useEffect(() => {
        if(isUpdate){
            setInfo(updateOrganization);
            setSelectedNodeKeys(updateOrganization.parentId)
        }
    }, [isUpdate,updateOrganization])

    const submit = (value) => {
        if(!isUpdate){
            createOrganizationApi(
                {
                    name:value.name,
                    code:value.code,
                    description:value.description,
                    parentId: selectedNodeKeys
                }
            ).then(r=>{
                toast.success("Thêm mới thành công")
                handleCloseModalEdit()
                setIsRefresh(!isRefresh)
            })
        }
        else {
            updateOrganizationApi(
                {
                    id:updateOrganization.id,
                    name:value.name,
                    code:value.code,
                    description:value.description,
                    parentId: selectedNodeKeys
                }
            ).then(r=>{
                toast.success("Cập nhật thành công")
                handleCloseModalEdit()
                setIsRefresh(!isRefresh)
            })
        }

    }
    const createOrganizationApi = (body) => {
      return apiOrganization.createOrganization(body)
    }
    const updateOrganizationApi = (body) => {
      return apiOrganization.updateOrganization(body)
    }
    const [filterValue, setFilterValue] = useState('');
    useEffect(()=>{
        if(!openModalEdit){
            setSelectedNodeKeys(0)
            setInfo({
                name: '',
                code: '',
                description: '',
                parentId: null,
            })
        }
    },[openModalEdit])
    const filterOptions = {
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
        filterValue: filterValue,

    };

    return (

        <div>
            <Dialog className={"modal"} open={openModalEdit} onClose={handleCloseModalEdit}>

                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        {
                        isUpdate?"Sửa cơ cấu tổ chức":"Thêm cơ cấu tổ chức"
                    }
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalEdit}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: info.name,
                        description: info.description,
                        code: info.code,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            let valueConvert = {...values};
                            submit(valueConvert)
                        }
                    }
                >
                    {props => {
                        const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            setFieldValue,
                            handleSubmit
                        } = props;
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={6} md={12}>
                                            <div className={'label-input'}>Tên đơn vị<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <div className={'label-input'}>Mã đơn vị<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='code'
                                                name='code'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.code}
                                                onChange={handleChange}
                                                error={touched.code && Boolean(errors.code)}
                                                helperText={touched.code && errors.code}
                                            />
                                        </Grid>
                                        {
                                            updateOrganization.id==0?'':<Grid item xs={6} md={12}>
                                                <div className={'label-input'}>Thuộc đơn vị<span
                                                    className={'error-message'}>*</span></div>
                                                <TreeSelect
                                                    {...filterOptions} filterMode="strict"
                                                    // filterMode="strict"
                                                    value={selectedNodeKeys}
                                                    onChange={(e) => {
                                                        setSelectedNodeKeys(e.value)
                                                    }}
                                                    options={sortTreeData(listOrganizationTree)}
                                                    expandedKeys={expandedKeys}
                                                    onToggle={(e) => setExpandedKeys(e.value)}
                                                    style={{width: '100%',zIndex:'1000000 !important', overflow: 'auto'}}
                                                    className="md:w-20rem w-full"
                                                    placeholder="Tất cả đơn vị"></TreeSelect>
                                            </Grid>
                                        }

                                        <Grid item xs={6} md={12}>
                                            <div className={'label-input'}>Ghi chú</div>
                                            <TextField
                                                className={'formik-input'}
                                                // variant="standard"
                                                id='description'
                                                name='description'
                                                multiline
                                                rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}
                                            />
                                        </Grid>

                                        {/*<Grid item xs={6} md={6}>*/}
                                        {/*    <input type="file"/>*/}
                                        {/*</Grid>*/}
                                        <Grid item xs={6} md={12}>
                                            <div className={''} style={{display: "flex", justifyContent: "center"}}>
                                                <Button style={{marginRight: '10px'}} onClick={handleCloseModalEdit}
                                                        variant="outlined">Hủy</Button>
                                                <Button disabled={disable} variant="contained"
                                                        type='submit'>Lưu</Button>

                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>

                            </Form>
                        )
                    }}
                </Formik>

            </Dialog>
        </div>
    );
}

export default ModalEditOrganization;
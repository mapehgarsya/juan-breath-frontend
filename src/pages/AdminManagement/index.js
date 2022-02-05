import React, { useState, useEffect } from 'react'
// import package/s
import Helmet from 'react-helmet';
// mock table data 
import { AdminsCOLUMN } from '../../components/BasicTable/columns';
import ToastNotification from '../../components/Toast/index.js';
// component/s
import HomeContainer from '../../components/HomeContainer';
import BasicTable from '../../components/BasicTable';
// utilitiess
import EditAdminModal from './utilities/EditAdminModal';
// apis
import { getAllAdmins } from "../../services/admins/get";
import { getAllLocations } from '../../services/locations/get';
import { getAllRoles } from "../../services/roles/get";
import { postOneAdmin } from "../../services/admins/post";
import AddAdminModal from './utilities/AddAdminModal';
import DeleteAdminModal from './utilities/DeleteAdminModal';

const AdminManagement = () => {

    const [admins, setAdmins] = useState([]);
    const [locations, setLocations] = useState([]);
    const [roles, setRoles] = useState([]);
    const [errorMsg, setErrorMsg] = useState([])
    const [showToast, setShowToast] = useState(false);
    const [toastStatue, setToastStatus] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    // add modal declaration
    const [showAddModal, setShowAddModal] = useState(false)

    // Edit modal declarations
    const [showEditModal, setShowEditModal] = useState(false);
    const handleCloseShowEditModal = () => setShowEditModal(false);
    const handleShowEditModal = () => setShowEditModal(true);

    // Delete modal declarations
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleCloseShowDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = () => setShowDeleteModal(true);

    // get all admin accounts
    const _getAllAdmins = async () => {
        try {
            const admins = await getAllAdmins();
            setAdmins(admins.data?.data);
        } catch (error) {
            setAdmins([]);
        }
    }
    // get all locations
    const _getAllLocation = async () => {
        try {
            const locations = await getAllLocations();
            setLocations(locations.data?.data);
        } catch (error) {
            setAdmins([]);
        }
    }
    // get all roles
    const _getAllRoles = async () => {
        try {
            const roles = await getAllRoles();
            setRoles(roles.data?.data);
        } catch (error) {
            setAdmins([]);
        }
    }
    // send the data to the backend to be created
    const _postOneAdmin = async (data) => {
        try {
            const result = await postOneAdmin(data);
            if(result.data.success) {
                setShowAddModal(!showAddModal);
                setAdmins([...admins, result.data.data]);
                setShowToast(!showToast);
                setToastMessage("Admin account has been created successfully.");
                setToastStatus('Success');
            }
        } catch (error) {
            setShowToast(!showToast);
            if(error.response?.status === 400) {
                setErrorMsg(error.response?.data.message.split('.'))
            }
            setToastMessage("Something went wrong.");
            setToastStatus('Danger');
        }
    }
    // this function will remove the error messages displayed on the form
    const handleClearError = (field) => {
        for(let i=0; i< errorMsg.length; i++) {
            if(errorMsg[i].includes(field)) {
                errorMsg.splice(i, 1);
            }
        }
        setErrorMsg([...errorMsg])
    }   

    // this function will auto run on mount
    useEffect(() => {
        _getAllAdmins();
        _getAllLocation();
        _getAllRoles();
    }, []);

    return (
        <HomeContainer >
            {/* Helmet for page's title*/}
            <Helmet>
                <title>JuanBreath | Admin Management</title>
            </Helmet>
            <div className='titleAndButtonDiv'>
                <h1 className='contentTitle'>Admin Management</h1>
                <AddAdminModal 
                    show={showAddModal}
                    errorMsg={errorMsg}
                    handleClose={() => setShowAddModal(!showAddModal)}
                    handleShow={() => setShowAddModal(!showAddModal)}
                    roles={roles}
                    locations={locations}
                    method={_postOneAdmin}
                    handleClearError={handleClearError}
                />
            </div>
            <div className='contentDiv'>
                <p className='tableCaption'>This table shows the list of other admins assigned in the system.</p>
                <BasicTable 
                    columnHeads = {AdminsCOLUMN}
                    tableData = {admins}
                    hasDelete={true}
                    hasEdit={true}
                    hasQR={false}
                    editModalFunction={handleShowEditModal}
                    deleteModalFunction={handleShowDeleteModal}
                />
            </div>
            <EditAdminModal 
                showFunction = {showEditModal}
                onHideFunction = {handleCloseShowEditModal}
                data = {admins}
            />
            <DeleteAdminModal
                showFunction = {showDeleteModal}
                onHideFunction = {handleCloseShowDeleteModal}
                data = {admins}
            />          
            <ToastNotification
                showToast={showToast}
                setShowToast={setShowToast}
                message={toastMessage}
                status={toastStatue}
            />  
        </HomeContainer>
        
    )
}

export default AdminManagement
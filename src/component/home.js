import React, { useEffect, useState } from 'react';
import './Assets/Styles/MyTasks.css';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Img from './Assets/Media/Images/nodata.png'
import { url } from './utils/constant';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import TaskDetailModal from './detailModel';

let departmentName = ['IT', "Audit", "Preform", 'Electrical', 'Security', 'Safety', 'HR', 'Sales', 'Store', 'Quality', 'Logistics', 'Accounts', 'Management', 'Purchase', 'Marketing', 'Civil', 'Maintenance', Packets "Others"];
const items = ["Laptop", "Desktop", "Printer", "Scanner", "Networking", "D-365 ERP", "Software/Application", "UPS", "CCTV", "Other Issue"];



const Home = () => {
    const [myTasks, setMyTasks] = useState([]);
    const [loader, setLoader] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [task, setTask] = useState({
        title: '',
        deptName: '',
        deptNumber: '',
        deptEmail: '',
        assignedTo: '',
        startDate: '',
        dueDate: '',
        status: '',
        priority: '',
        remark: '',
        descriptions: '',
    })

    const [date, setDate] = useState({
        startDate: '',
        endDate: ''
    });

    const dateHandleChange = (e) => {
        const { name, value } = e.target;
        setDate((newData) => {
            return ({ ...newData, [name]: value })
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task, [name]: value
        })
    }

    const isFieldComplete = () => {
        const selectedFields = ['title', 'deptName', 'assignedTo', 'status', 'priority'];
        return selectedFields.every((item) => task[item] !== '');
    }

    const addTask = async () => {
        const { title, deptName, deptNumber, deptEmail, assignedTo, descriptions, priority, remark, status, startDate, dueDate } = task;
        // console.log(title, deptName, deptNumber, deptEmail, assignedTo, descriptions, priority, status, startDate, dueDate)

        try {
            const response = await fetch(`${url}/api/v1/user/addTask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    title: title,
                    deptName: deptName,
                    deptNumber: deptNumber,
                    deptEmail: deptEmail,
                    assignedTo: assignedTo,
                    descriptions: descriptions,
                    priority: priority,
                    remark: remark,
                    status: status,
                    startDate: startDate,
                    dueDate: dueDate,
                }),
            });

            const data = await response.json();
            console.log(data)
            fetchMyAllTask();
            setTask({
                ...task, title: '', deptName: '', deptEmail: '', deptNumber: '', assignedTo: '',
                descriptions: '', priority: '', remark: '', status: '', startDate: '', dueDate: ''
            });

        } catch (error) {
            console.error("Error during Add Task:", error);
        }
    }


    const [view, setview] = useState(false);
    const handleViewClose = () => setview(false);
    const [viewDetail, getViewDetail] = useState();

    const showDetails = async (id) => {

        const response = await fetch(`${url}/api/v1/user/getTaskDetail/${id}`, {
            method: "GET",
            headers: {
                'token': localStorage.getItem('token'),
                'Content-Type': 'application/json',
            }
        })

        const data = await response.json();
        // console.log(data)
        getViewDetail(data.details);
        setview(true)
    }

    function convertDate(newDate) {
        if (!newDate) {
            return
        }
        const parts = newDate.split('-');
        const newDateFormate = parts[2] + '-' + parts[1] + '-' + parts[0];
        // console.log(newDateFormate);
        return newDateFormate;
    }

    const fetchMyAllTask = async () => {
        const { startDate, endDate } = date;
        try {
            const response = await fetch(`${url}/api/v1/user/getTasks?startDate=${startDate}&endDate=${endDate}`, {
                method: 'GET',
                headers: {
                    'token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
            });
            const getResponse = await response.json();
            console.log(getResponse);

            setMyTasks(getResponse.tasks);
            setLoader(false);
        } catch (e) {
            console.log('Error in verifying token:', e);
        }
    };


    const addTaskAndClose = () => {
        addTask();
        handleClose();
    }

    // Show a Yes/No dialog on before Delete

    const showDeleteTaskModal = (id) => {

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Task!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                swal("Poof! Your Task has been deleted!", {
                    icon: "success",
                });
                deleteTask(id);
            } else {
                swal("Your Task is safe!");
            }
        });
    }


    const deleteTask = async (id) => {

        try {
            const res = await fetch(`${url}/api/v1/user/tasks/delete/${id}`, {
                method: "GET",
                headers: {
                    'token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            })

            const getRes = await res.json();
            // console.log(getRes);
            fetchMyAllTask();

        } catch (error) {
            console.log("Error while deleting courses", error);
        }
    }

    // Edit Task

    const [edit, setEdit] = useState(false);
    const [editDetail, setEditDetail] = useState({
        _id: '',
        title: '',
        deptName: '',
        deptNumber: '',
        deptEmail: '',
        assignedTo: '',
        startDate: '',
        dueDate: '',
        status: '',
        priority: '',
        remark: '',
        descriptions: '',
    });

    const showEditModal = () => setEdit(true);
    const handleEditClose = () => setEdit(false);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditDetail((newData) => {
            return {
                ...newData,
                [name]: value,
            }
        })
    }

    const getEditTaskDetail = async (id) => {
        showEditModal();

        try {
            const res = await fetch(`${url}/api/v1/user/tasks/edit/${id}`, {
                method: "GET",
                headers: {
                    'token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            })

            const getRes = await res.json();
            // console.log(getRes);
            setEditDetail(getRes.details)

        } catch (error) {
            console.log("Error while deleting courses", error);
        }
    }


    const updateTaskDetail = async () => {
        const { _id, title, deptName, deptNumber, deptEmail, assignedTo, descriptions, priority, remark, status, startDate, dueDate } = editDetail;

        try {
            const response = await fetch(`${url}/api/v1/user/tasks/update/${_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    title: title,
                    deptName: deptName,
                    deptNumber: deptNumber,
                    deptEmail: deptEmail,
                    assignedTo: assignedTo,
                    descriptions: descriptions,
                    priority: priority,
                    remark: remark,
                    status: status,
                    startDate: startDate,
                    dueDate: dueDate,
                }),
            });

            const data = await response.json();
            console.log(data)
            fetchMyAllTask();

        } catch (error) {
            console.error("Error during update Task:", error);
        }
    }

    const editTaskAndClose = () => {
        updateTaskDetail();
        handleEditClose();
    }

    // search tasks

    const [search, setSearch] = useState('');

    const searchTask = myTasks.filter((task) => {
        return task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.descriptions.toLowerCase().includes(search.toLowerCase()) ||
            task.deptName.toLowerCase().includes(search.toLowerCase()) ||
            task.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
            task.priority.toLowerCase().includes(search.toLowerCase()) ||
            task.status.toLowerCase().includes(search.toLowerCase())
    })


    // pagination

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const paginatedTask = searchTask.slice((currentPage - 1) * pageSize, (currentPage * pageSize));

    const totalTask = myTasks.length;
    const totalPage = Math.ceil(totalTask / pageSize);


    useEffect(() => {
        fetchMyAllTask();
    }, []);

    return (
        <>

            {/* desktop view */}
            <div className="container-fluid table-container-desktop">
                <div className='d-flex justify-content-between'>
                    <div className='mycourses-main-heading'>
                        All Incident
                    </div>
                    <div className='d-flex gap-2'>
                        <div className='d-flex gap-2'>
                            <input type='date' value={date.startDate} name='startDate' onChange={dateHandleChange} className='searchBar ' />
                            <input type='date' value={date.endDate} name='endDate' onChange={dateHandleChange} className='searchBar ' />
                        </div>
                        <div>
                            <button onClick={fetchMyAllTask} className='viewDetailsOnMyCourse' style={{ paddingTop: '2px', paddingBottom: '2px' }} >
                                <i className="bi bi-funnel" style={{ fontSize: '1rem' }}></i>
                            </button>
                        </div>
                        <div>
                            <i className="bi bi-search mx-1"></i>
                            <input value={search} onChange={(e) => setSearch(e.target.value)} className='searchBar' placeholder='search...' />
                        </div>
                        <div>
                            <button className='addTask' onClick={handleShow}>+ Add Task</button>
                        </div>
                    </div>
                </div>
                <div className='mycoruse-table-container'>
                    <table className="courses-table">
                        <thead>
                            <tr>
                                <th>UIIN</th>
                                <th>Title
                                    <i className="bi bi-funnel" style={{ textAlign: 'right', cursor: 'pointer', paddingLeft: '5px' }}></i>
                                </th>
                                <th>Dep. Name
                                    <i className="bi bi-funnel" style={{ textAlign: 'right', cursor: 'pointer', paddingLeft: '5px' }}></i>
                                </th>
                                <th>Complaint From
                                    <i className="bi bi-funnel" style={{ textAlign: 'right', cursor: 'pointer', paddingLeft: '5px' }}></i>
                                </th>
                                <th>Dep. Email
                                    <i className="bi bi-funnel" style={{ textAlign: 'right', cursor: 'pointer', paddingLeft: '5px' }}></i>
                                </th>
                                <th>Assigned To
                                    <i className="bi bi-funnel" style={{ textAlign: 'right', cursor: 'pointer', paddingLeft: '5px' }}></i>
                                </th>
                                <th>Description</th>
                                <th>Remark</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Priority
                                    <i className="bi bi-funnel" style={{ textAlign: 'right', cursor: 'pointer', paddingLeft: '5px' }}></i>
                                </th>
                                <th>Status
                                    <i className="bi bi-funnel" style={{ textAlign: 'right', cursor: 'pointer', paddingLeft: '5px' }}></i>
                                </th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {loader ?
                                <>
                                    <tr>
                                        <td colSpan='8'>
                                            <div className='circle'>
                                                <div className="spinner-border">
                                                </div>
                                                <strong >Loading...</strong>
                                            </div>
                                        </td>
                                    </tr>
                                </>
                                :
                                <>
                                    {
                                        paginatedTask.length === 0 ?
                                            <>
                                                <tr>
                                                    <td colSpan="14" className="image-row">
                                                        <img src={Img} className='noData' alt='nodata' />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="14" className="noDataText">
                                                        No Data Found!
                                                    </td>
                                                </tr>
                                            </>
                                            :
                                            paginatedTask.map((e, index) => (
                                                <tr key={e._id}>
                                                    <td>UN0000{((currentPage - 1) * 10) + (index + 1)}</td>
                                                    <td>{e.title}</td>
                                                    <td>{e.deptName}</td>
                                                    <td>{e.deptNumber}</td>
                                                    <td>{e.deptEmail}</td>
                                                    <td>{e.assignedTo}</td>
                                                    <td>{e.descriptions}</td>
                                                    <td>{e.remark}</td>
                                                    <td>
                                                        <span>{convertDate(e.startDate)}</span>
                                                    </td>
                                                    <td>
                                                        <span>{convertDate(e.dueDate)}</span>
                                                    </td>
                                                    <td>
                                                        {e.status === 'Cancel' ?
                                                            <span className={
                                                                `${e.priority === 'Low' ?
                                                                    'Low' :
                                                                    e.priority === 'Medium' ?
                                                                        'Medium' : 'High'
                                                                }`
                                                            } style={{ pointerEvents: 'none', opacity: 0.5, backgroundColor: 'grey', color: 'black' }}>{e.priority}</span>
                                                            :
                                                            <span className={
                                                                `${e.priority === 'Low' ?
                                                                    'Low' :
                                                                    e.priority === 'Medium' ?
                                                                        'Medium' : 'High'
                                                                }`
                                                            }>{e.priority}</span>
                                                        }

                                                    </td>
                                                    <td>
                                                        <span className={
                                                            `${e.status === 'Start' ?
                                                                'Start' :
                                                                e.status === 'Ongoing' ?
                                                                    'Ongoing' :
                                                                    e.status === 'Done' ?
                                                                        'Done' :
                                                                        e.status === 'Cancel' ?
                                                                            'Cancel' : 'onHold'
                                                            }`
                                                        }>{e.status}</span>
                                                    </td>
                                                    {/* <i onClick={() => showDeleteTaskModal(e._id)} className="bi bi-trash-fill"></i> */}
                                                    <td className='actionBtn'>
                                                        {e.status === "Cancel" ?
                                                            <i onClick={() => { getEditTaskDetail(e._id); }} className="bi bi-pencil-square disabled"
                                                                style={{ pointerEvents: 'none', opacity: 0.5, color: 'black' }}></i> :
                                                            <i onClick={() => { getEditTaskDetail(e._id); }} className="bi bi-pencil-square"></i>
                                                        }
                                                    </td>
                                                    <td>
                                                        <button onClick={() => showDetails(e._id)} className='viewDetailsOnMyCourse'>View Details</button>
                                                    </td>
                                                </tr>
                                            ))

                                    }
                                </>
                            }


                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }} className='mt-2'>
                    <span className='mx-1 mt-2'> Total complaint: <b>{totalTask}</b></span>
                    {currentPage === 1 ?
                        <button className='mx-1' disabled={true}>First</button> :
                        <button className='viewDetailsOnMyCourse mx-1' onClick={() => setCurrentPage(1)}>First</button>
                    }
                    {currentPage === 1 ?
                        <button className='mx-1' disabled={true}>Back</button> :
                        <button className='viewDetailsOnMyCourse' onClick={() => setCurrentPage((prevState) => prevState - 1)}>Back</button>
                    }
                    <span className='viewDetailsOnMyCourse mx-1'>{currentPage}</span>
                    {currentPage >= totalPage ?
                        <button className='mx-1' disabled={true}>Next</button> :
                        <button className='viewDetailsOnMyCourse mx-1' onClick={() => setCurrentPage((prevState) => prevState + 1)}>Next</button>
                    }
                    {currentPage === totalPage ?
                        <button className='mx-1' disabled={true}>Last</button> :
                        <button className='viewDetailsOnMyCourse' onClick={() => setCurrentPage(totalPage)}>Last</button>
                    }
                </div>
            </div>

            {/* mobile view */}
            <div className="container-fluid table-container-mobile">
                <div className='d-flex justify-content-between mt-5'>
                    <div className='mycourses-main-heading'>
                        All Incident
                    </div>
                    <div>
                        <button className='addTask' onClick={handleShow}>+ Add Task</button>
                    </div>
                </div>
                <div className='mycoruse-table-container'>
                    <table className="courses-table">
                        <thead>
                            <tr>
                                <th>UIIN</th>
                                <th>Title</th>
                                <th>Dep. Name</th>
                                <th>Dep. Number</th>
                                <th>Dep. Email</th>
                                <th>Assigned To</th>
                                <th>Description</th>
                                <th>Remark</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {
                                myTasks.length === 0 ?
                                    <>
                                        <tr>
                                            <td colSpan="12" className="image-row">
                                                <img src={Img} className='noData' alt='nodata' />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12" className="noDataText">
                                                No Data Found!
                                            </td>
                                        </tr>
                                    </>
                                    :
                                    myTasks.map((e) => (
                                        <tr key={e._id}>
                                            <td>{e.title}</td>
                                            <td>{e.deptName}</td>
                                            <td>{e.deptNumber}</td>
                                            <td>{e.deptEmail}</td>
                                            <td>{e.assignedTo}</td>
                                            <td>{e.descriptions}</td>
                                            <td>{e.remark}</td>
                                            <td>
                                                <span>{e.startDate}</span>
                                            </td>
                                            <td>
                                                <span>{e.dueDate}</span>
                                            </td>
                                            <td>
                                                <span className={
                                                    `${e.priority === 'Low' ?
                                                        'Low' :
                                                        e.priority === 'Medium' ?
                                                            'Medium' : 'High'
                                                    }`
                                                }>{e.priority}</span>
                                            </td>
                                            <td>
                                                <span className={
                                                    `${e.status === 'Start' ?
                                                        'Start' :
                                                        e.status === 'Ongoing' ?
                                                            'Ongoing' :
                                                            e.status === 'Done' ?
                                                                'Done' :
                                                                e.status === 'Cancel' ?
                                                                    'Cancel' : 'onHold'
                                                    }`
                                                }>{e.status}</span>
                                            </td>
                                            <td className='actionBtn'>
                                                <i onClick={() => showDeleteTaskModal(e._id)} className="bi bi-trash-fill"></i>
                                                <i onClick={() => { getEditTaskDetail(e._id); }} className="bi bi-pencil-square"></i>
                                            </td>
                                            <td>
                                                <button onClick={() => showDetails(e._id)} className='viewDetailsOnMyCourse'>View Details</button>
                                            </td>
                                        </tr>
                                    ))

                            }
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }} className='mt-2'>
                    {currentPage >= totalPage ?
                        <button className='mx-1' disabled={true}>Next</button> :
                        <button className='viewDetailsOnMyCourse mx-1' onClick={() => setCurrentPage((prevState) => prevState + 1)}>Next</button>
                    }

                    <span className='viewDetailsOnMyCourse mx-2'>{currentPage}</span>

                    {currentPage === 1 ?
                        <button className={currentPage === 1 ? '' : 'viewDetailsOnMyCourse'} disabled={true}>Back</button> :
                        <button className='viewDetailsOnMyCourse' onClick={() => setCurrentPage((prevState) => prevState - 1)}>Back</button>
                    }
                </div>
            </div>

            {/* Add Tasks Model */}
            <>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton />
                    <h3 className='text-center'>Add Incident</h3>
                    <Modal.Body>
                        <Form>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Title*</Form.Label>
                                    <select value={task.title} name="title" onChange={handleChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option hidden>
                                            select
                                        </option>
                                        {items.map((name, index) => {
                                            return (

                                                <option key={index} value={name}>{name}</option>

                                            )
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <Form.Label>Department Name*</Form.Label>
                                    <select value={task.deptName} name="deptName" onChange={handleChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option hidden>
                                            select
                                        </option>
                                        {departmentName.map((name, index) => {
                                            return (

                                                <option key={index} value={name}>{name}</option>

                                            )
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Department Email</Form.Label>
                                    <input value={task.deptEmail} onChange={handleChange} name='deptEmail' type='text' className='form-control mb-3 inputBox startDate' />
                                </div>

                                <div>
                                    <Form.Label>Complaint From</Form.Label>
                                    <input value={task.deptNumber} onChange={handleChange} name='deptNumber' type='text' className='form-control mb-3 inputBox dueDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Assigned To*</Form.Label>
                                    <select value={task.assignedTo} name="assignedTo" onChange={handleChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option hidden>
                                            select
                                        </option>
                                        <option>Rakesh Agarwal</option>
                                        <option>Abhishek Awasthi</option>
                                        <option>Bhupendra Pal Saxsena</option>
                                        <option>Neeraj Mehrotra</option>
                                        <option>Raj</option>
                                        <option>Sonu</option>
                                        <option>Mohit Sharma</option>
                                        <option>Munish Kumar</option>
                                    </select>
                                </div>
                                <div>
                                    <Form.Label>Start Date</Form.Label>
                                    <input value={task.startDate} onChange={handleChange} name='startDate' type='date' className='form-control mb-3 inputBox startDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>

                                <div>
                                    <Form.Label>Status*</Form.Label>
                                    <select value={task.status} name="status" onChange={handleChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option hidden>
                                            select
                                        </option>
                                        <option>Start</option>
                                        <option>Ongoing</option>
                                        <option>Close</option>
                                        <option>On hold</option>
                                    </select>
                                </div>
                                <div>
                                    <Form.Label>Due Date</Form.Label>
                                    <input value={task.dueDate} onChange={handleChange} name='dueDate' type='date' className='form-control mb-3 inputBox dueDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Form.Label>Priority*</Form.Label>
                                    <select value={task.priority} name='priority' onChange={handleChange} type='text' className="form-select mb-3 inputBox priorityBox">
                                        <option hidden>
                                            select
                                        </option>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                                <div>
                                    <Form.Label>Remark</Form.Label>
                                    <input value={task.remark} onChange={handleChange} name='remark' type='text' className='form-control mb-3 inputBox startDate' />
                                </div>
                            </div>

                            <Form.Group
                                className="mb-3 inputBox"
                                controlId="exampleForm.ControlTextarea1"
                            >
                                <Form.Label>Description</Form.Label>
                                <Form.Control value={task.descriptions} name='descriptions' onChange={handleChange} className='descriptionBox' as="textarea" rows={3} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='closeBtn' onClick={handleClose}>Close</Button>
                        <Button className='closeBtn'
                            style={isFieldComplete() ? {} : { backgroundColor: 'lightgrey', color: 'black' }}
                            onClick={addTaskAndClose} disabled={isFieldComplete() ? false : true}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>


                {/* Show Details Model */}


                <TaskDetailModal view={view} handleViewClose={handleViewClose} viewDetail={viewDetail} />


                {/* show Edit Model */}

                <Modal show={edit} onHide={handleEditClose}>
                    <Modal.Header closeButton />
                    <h3 className='text-center'>Edit Incident</h3>
                    <Modal.Body>
                        <Form>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Title</Form.Label>
                                    <select value={editDetail.title} name="title" onChange={handleEditChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option hidden>
                                            select
                                        </option>
                                        {items.map((name, index) => {
                                            return (

                                                <option key={index} value={name}>{name}</option>

                                            )
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <Form.Label>Department Name</Form.Label>
                                    <select value={editDetail.deptName} name="deptName" onChange={handleChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option hidden>
                                            select
                                        </option>
                                        {departmentName.map((name, index) => {
                                            return (
                                                <option key={index} value={name}>{name}</option>

                                            )
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Department Email</Form.Label>
                                    <input value={editDetail.deptEmail} onChange={handleEditChange} name='deptEmail' type='text' className='form-control mb-3 inputBox startDate' />
                                </div>

                                <div>

                                    <Form.Label>Complaint From</Form.Label>
                                    <input value={editDetail.deptNumber} onChange={handleEditChange} name='deptNumber' type='text' className='form-control mb-3 inputBox dueDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>

                                <div>
                                    <Form.Label>Assigned To</Form.Label>
                                    <select value={editDetail.assignedTo} name="assignedTo" onChange={handleEditChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option>Abhishek Awasthi</option>
                                        <option>Bhupendra Pal Saxsena</option>
                                        <option>Neeraj Mehrotra</option>
                                        <option>Raj</option>
                                        <option>Sonu</option>
                                        <option>Mohit Sharma</option>
                                        <option>Munish Kumar</option>
                                    </select>
                                </div>
                                <div>
                                    <Form.Label>Start Date</Form.Label>
                                    <input value={editDetail.startDate} onChange={handleEditChange} name='startDate' type='date' className='form-control mb-3 inputBox startDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Status</Form.Label>
                                    <select value={editDetail.status} name="status" onChange={handleEditChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option>Start</option>
                                        <option>Ongoing</option>
                                        <option>Close</option>
                                        <option>On hold</option>
                                        <option>Cancel</option>
                                    </select>
                                </div>

                                <div>
                                    <Form.Label>Due Date</Form.Label>
                                    <input value={editDetail.dueDate} onChange={handleEditChange} name='dueDate' type='date' className='form-control mb-3 inputBox dueDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Form.Label>Priority</Form.Label>
                                    <select value={editDetail.priority} name='priority' onChange={handleEditChange} type='text' className="form-select mb-3 inputBox priorityBox">
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                                <div>
                                    <Form.Label>Remark* </Form.Label>
                                    <input value={editDetail.remark} onChange={handleEditChange} name='remark' type='text' className='form-control mb-3 inputBox startDate' />
                                </div>
                            </div>

                            <Form.Group
                                className="mb-3 inputBox"
                                controlId="exampleForm.ControlTextarea1"
                            >
                                <Form.Label>Description</Form.Label>
                                <Form.Control value={editDetail.descriptions} name='descriptions' onChange={handleEditChange} className='descriptionBox' as="textarea" rows={3} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='closeBtn' onClick={handleEditClose}>Close</Button>
                        <Button className='closeBtn' onClick={editTaskAndClose}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </>
        </>
    );
}

export default Home;



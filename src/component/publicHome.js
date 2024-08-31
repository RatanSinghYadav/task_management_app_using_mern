import React, { useEffect, useState } from 'react';
import './Assets/Styles/MyTasks.css';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Img from './Assets/Media/Images/nodata.png'
import { url } from './utils/constant';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const PublicHome = () => {
    const [myTasks, setMyTasks] = useState([]);
    const [loader, setLoader] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [task, setTask] = useState({
        title: '',
        descriptions: '',
        status: 'Start',
        priority: 'Low',
        startDate: '',
        dueDate: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task, [name]: value
        })
    }

    const pleaseLoginFirst = () => {
        swal({
            title: "Oops",
            text: `You are not Authorized!`,
            icon: "error",
            button: "Ok",
        });
    }


    const [view, setview] = useState(false);
    const handleViewClose = () => setview(false);
    const [viewDetail, getViewDetail] = useState();

    const showDetails = async (id) => {

        const response = await fetch(`${url}/api/v1/public/getTaskDetail/${id}`, {
            method: "GET",
            headers: {
                // 'token': localStorage.getItem('token'),
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning':'true',
            }
        })

        const data = await response.json();
        // console.log(data)
        getViewDetail(data.details);
        setview(true)
    }

    const fetchMyAllTask = async () => {
        try {
            const response = await fetch(`${url}/api/v1/public/getTasks`, {
                method: 'GET',
                headers: {
                    // 'token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning':'true',
                },
            });
            const getResponse = await response.json();
            // console.log(getResponse);

            setMyTasks(getResponse.tasks);
            setLoader(false);
        } catch (e) {
            console.log('Error in verifying token:', e);
        }
    };

    // Show a Yes/No dialog on before Delete


    // Edit Task

    const [edit, setEdit] = useState(false);
    const [editDetail, setEditDetail] = useState({
        _id: '',
        title: '',
        descriptions: '',
        status: '',
        priority: '',
        startDate: '',
        dueDate: '',
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

    // const getEditTaskDetail = async (id) => {
    //     showEditModal();

    //     try {
    //         const res = await fetch(`${url}/api/v1/user/tasks/edit/${id}`, {
    //             method: "GET",
    //             headers: {
    //                 'token': localStorage.getItem('token'),
    //                 'Content-Type': 'application/json',
    //             }
    //         })

    //         const getRes = await res.json();
    //         // console.log(getRes);
    //         setEditDetail(getRes.details)

    //     } catch (error) {
    //         console.log("Error while deleting courses", error);
    //     }
    // }


    const updateTaskDetail = async () => {
        const { _id, title, descriptions, status, priority } = editDetail;

        try {
            const response = await fetch(`${url}/api/v1/user/tasks/update/${_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'token': localStorage.getItem('token'),
                    'ngrok-skip-browser-warning':'true',
                },
                body: JSON.stringify({
                    title: title,
                    descriptions: descriptions,
                    status: status,
                    priority: priority
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

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/user/home");
        }
        fetchMyAllTask();
    }, []);


    // search tasks

    const [search, setSearch] = useState('');

    const searchTask = myTasks?.filter((task) => {
        return (
            (task.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (task.descriptions || '').toLowerCase().includes(search.toLowerCase()) ||
            (task.deptName || '').toLowerCase().includes(search.toLowerCase()) ||
            (task.assignedTo || '').toLowerCase().includes(search.toLowerCase()) ||
            (task.priority || '').toLowerCase().includes(search.toLowerCase()) ||
            (task.status || '').toLowerCase().includes(search.toLowerCase())
        );
    })


    // pagination

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const paginatedTask = searchTask?.slice((currentPage - 1) * pageSize, (currentPage * pageSize));

    const totalTask = myTasks?.length;
    const totalPage = Math.ceil(totalTask / pageSize);

    return (
        <>
            {/* desktop view */}
            <div className="container table-container-desktop">
                <div className='d-flex justify-content-between'>
                    <div className='mycourses-main-heading'>
                        All Incident
                    </div>
                    <div className='d-flex gap-2'>
                        <div>
                            <i className="bi bi-funnel" style={{ fontSize: '1.4rem' }}></i>
                        </div>
                        <div>
                            <i className="bi bi-search mx-1"></i>
                            <input value={search} onChange={(e) => setSearch(e.target.value)} className='searchBar' placeholder='search...' />
                        </div>
                        <div>
                            {/* <button className='addTask' onClick={handleShow}>+ Add Task</button> */}
                        </div>
                    </div>
                </div>
                <div className='mycoruse-table-container'>
                    <table className="courses-table">
                        <thead>
                            <tr>
                                <th>UIIN</th>
                                <th>Title</th>
                                <th>Dep. Name</th>
                                <th>Complaint From</th>
                                <th>Dep. Email</th>
                                <th>Assigned To</th>
                                <th>Description</th>
                                <th>Remark</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                {/* <th>Action</th> */}
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {loader ?
                                <>
                                    <tr>
                                        <td colSpan='14'>
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
                                        paginatedTask?.length === 0 ?
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
                                            paginatedTask?.map((e, index) => (
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
                                                        <span>{e.startDate}</span>
                                                    </td>
                                                    <td>
                                                        <span>{e.dueDate}</span>
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
                                                    {/* <i onClick={() => pleaseLoginFirst(e._id)} className="bi bi-trash-fill"></i> */}
                                                    {/* <td className='actionBtn'>
                                                        {e.status === "Cancel" ?
                                                            <i className="bi bi-pencil-square disabled"
                                                                style={{ pointerEvents: 'none', opacity: 0.5, color: 'black' }}></i> :
                                                            <i onClick={() => pleaseLoginFirst(e._id)} className="bi bi-pencil-square"></i>
                                                        }
                                                    </td> */}
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
                    {currentPage === totalPage?
                        <button className='mx-1' disabled={true}>Last</button> :
                        <button className='viewDetailsOnMyCourse' onClick={() => setCurrentPage(totalPage)}>Last</button>
                    }
                </div>
            </div>

            {/* mobile view */}
            <div className="container table-container-mobile">
                <div className='d-flex justify-content-between mt-5'>
                    <div className='mycourses-main-heading'>
                        My Tasks
                    </div>
                    <div>
                        <button className='addTask' onClick={pleaseLoginFirst}>+ Add Task</button>
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
                                paginatedTask?.length === 0 ?
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
                                    paginatedTask?.map((e, index) => (
                                        <tr key={e._id}>
                                            <td>UN0{index + 1}</td>
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
                                                                'Done' : 'onHold'
                                                    }`
                                                }>{e.status}</span>
                                            </td>
                                            <td className='actionBtn'>
                                                {/* <i onClick={pleaseLoginFirst} className="bi bi-trash-fill"></i> */}
                                                <i onClick={pleaseLoginFirst} className="bi bi-pencil-square"></i>
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
                    {currentPage === 1 ?
                        <button className={currentPage === 1 ? '' : 'viewDetailsOnMyCourse'} disabled={true}>Back</button> :
                        <button className='viewDetailsOnMyCourse' onClick={() => setCurrentPage((prevState) => prevState - 1)}>Back</button>
                    }
                    <span className='viewDetailsOnMyCourse mx-2'>{currentPage}</span>
                    {currentPage >= totalPage ?
                        <button className='mx-1' disabled={true}>Next</button> :
                        <button className='viewDetailsOnMyCourse mx-1' onClick={() => setCurrentPage((prevState) => prevState + 1)}>Next</button>
                    }
                </div>
            </div>

            {/* Add Tasks Model */}
            <>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton />
                    <h3 className='text-center'>Add Task</h3>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3 inputBox" controlId="exampleForm.ControlInput1">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    value={task.title}
                                    onChange={handleChange}
                                    name='title'
                                    type="text"
                                    placeholder="add task..."
                                    className='form-control mb-3 inputBox'
                                />
                            </Form.Group>


                            <Form.Label>Start Date</Form.Label>
                            <input value={task.startDate} onChange={handleChange} name='startDate' type='date' className='form-control mb-3 inputBox' />

                            <Form.Label>Due Date</Form.Label>
                            <input value={task.dueDate} onChange={handleChange} name='dueDate' type='date' className='form-control mb-3 inputBox' />

                            <Form.Label>Status</Form.Label>
                            <select value={task.status} name="status" onChange={handleChange} type='text' className="form-select mb-3 inputBox">
                                <option>Start</option>
                                <option>Ongoing</option>
                                <option>Done</option>
                                <option>On hold</option>
                            </select>

                            <Form.Label>Priority</Form.Label>
                            <select value={task.priority} name='priority' onChange={handleChange} type='text' className="form-select mb-3 inputBox">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>

                            <Form.Group
                                className="mb-3 inputBox"
                                controlId="exampleForm.ControlTextarea1"
                            >
                                <Form.Label>Description</Form.Label>
                                <Form.Control value={task.descriptions} name='descriptions' onChange={handleChange} className='inputBox' as="textarea" rows={3} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='closeBtn' onClick={handleClose}>Close</Button>
                        <Button className='closeBtn' onClick={pleaseLoginFirst}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>


                {/* Show Details Model */}

                <Modal show={view} onHide={handleViewClose}>
                    <Modal.Header closeButton />
                    <h3 className='text-center'>Task Details</h3>
                    <Modal.Body><b>Title :</b> {viewDetail && viewDetail.title}</Modal.Body>
                    <Modal.Body><b>Department Name :</b> {viewDetail && viewDetail.deptName}</Modal.Body>
                    <Modal.Body><b>Department Email :</b> {viewDetail && viewDetail.deptEmail}</Modal.Body>
                    <Modal.Body><b>Department Number :</b> {viewDetail && viewDetail.deptNumber}</Modal.Body>
                    <Modal.Body><b>Assigned To :</b> {viewDetail && viewDetail.assignedTo}</Modal.Body>
                    <Modal.Body><b>Remark :</b> {viewDetail && viewDetail.remark}</Modal.Body>
                    <Modal.Body><b>Description :</b> {viewDetail && viewDetail.descriptions}</Modal.Body>
                    <Modal.Body><b>Start Date :</b> {viewDetail && viewDetail.startDate}</Modal.Body>
                    <Modal.Body><b>End Date :</b> {viewDetail && viewDetail.dueDate}</Modal.Body>
                    <Modal.Body><b>Priority :</b> {viewDetail && viewDetail.priority}</Modal.Body>
                    <Modal.Body><b>Status :</b> {viewDetail && viewDetail.status}</Modal.Body>
                    <Modal.Footer>
                        <Button className='closeBtn' onClick={handleViewClose}> Close </Button>
                    </Modal.Footer>
                </Modal>

                {/* show Edit Model */}

                <Modal show={edit} onHide={handleEditClose}>
                    <Modal.Header closeButton />
                    <h3 className='text-center'>Edit Task</h3>
                    <Modal.Body>
                        <Form>
                            <Form.Label>Title</Form.Label>
                            <input
                                value={editDetail.title}
                                onChange={handleEditChange}
                                name='title'
                                type="text"
                                placeholder="add task..."
                                className='form-control mb-3 inputBox'
                            />

                            <Form.Label>Start Date</Form.Label>
                            <input value={editDetail.startDate} onChange={handleEditChange} name='startDate' type='date' className='form-control mb-3 inputBox' />

                            <Form.Label>Due Date</Form.Label>
                            <input value={editDetail.dueDate} onChange={handleEditChange} name='dueDate' type='date' className='form-control mb-3 inputBox' />

                            <Form.Label>Status</Form.Label>
                            <select value={editDetail.status} name="status" onChange={handleEditChange} type='text' class="form-select mb-3 inputBox">
                                <option>Start</option>
                                <option>Ongoing</option>
                                <option>Done</option>
                                <option>On hold</option>
                            </select>

                            <Form.Label>Priority</Form.Label>
                            <select value={editDetail.priority} name='priority' onChange={handleEditChange} type='text' class="form-select mb-3 inputBox">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>

                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1"
                            >
                                <Form.Label>Description</Form.Label>
                                <Form.Control value={editDetail.descriptions} name='descriptions' onChange={handleEditChange} as="textarea" className='inputBox' rows={3} />
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

export default PublicHome;



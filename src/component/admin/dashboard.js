import React, { useEffect, useState } from 'react';
import '../Assets/Styles/MyTasks.css';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Img from '../Assets/Media/Images/nodata.png'
import { url } from '../utils/constant';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Dashboard = () => {
    const [myTasks, setMyTasks] = useState([]);
    const [loader, setLoader] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [task, setTask] = useState({
        title: '',
        startDate: '',
        dueDate: '',
        status: 'Start',
        priority: 'Low',
        descriptions: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task, [name]: value
        })
    }

    const addTask = async () => {
        const { title, descriptions, priority, status, startDate, dueDate } = task;
        // console.log(title, descriptions, priority, status, startDate, dueDate)

        try {
            const response = await fetch(`${url}/api/v1/user/addTask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    title: title,
                    descriptions: descriptions,
                    priority: priority,
                    status: status,
                    startDate: startDate,
                    dueDate: dueDate,
                }),
            });

            const data = await response.json();
            // console.log(data)
            fetchMyAllTask();

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

    const fetchMyAllTask = async () => {
        try {
            const response = await fetch(`${url}/api/v1/user/getTasks`, {
                method: 'GET',
                headers: {
                    'token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
            });
            const getResponse = await response.json();
            // console.log(getResponse.tasks);

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
        const { _id, title, descriptions, status, priority } = editDetail;

        try {
            const response = await fetch(`${url}/api/v1/user/tasks/update/${_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    title: title,
                    descriptions: descriptions,
                    status: status,
                    priority: priority
                }),
            });

            const data = await response.json();
            // console.log(data)
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
            task.descriptions.toLowerCase().includes(search.toLowerCase())
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
                            <button className='addTask' onClick={handleShow}>+ Add Task</button>
                        </div>
                    </div>
                </div>
                <div className='mycoruse-table-container'>
                    <table className="courses-table">
                        <thead>
                            <tr><th>UIIN</th>
                                <th>Title</th>
                                <th>Dep. Name</th>
                                <th>Dep. Number</th>
                                <th>Dep. Email</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
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
                                            paginatedTask.map((e, index) => (
                                                <tr key={e._id}>
                                                    <td>UN0{index + 1}</td>
                                                    <td>{e.title}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{e.descriptions}</td>
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
                                                        <i onClick={() => showDeleteTaskModal(e._id)} className="bi bi-trash-fill"></i>
                                                        <i onClick={() => { getEditTaskDetail(e._id); }} className="bi bi-pencil-square"></i>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => showDetails(e._id)} classNameName='viewDetailsOnMyCourse'>View Details</button>
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

            {/* mobile view */}
            <div className="container table-container-mobile">
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
                                <th>Title</th>
                                <th>Description</th>
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
                                            <td colSpan="8" className="image-row">
                                                <img src={Img} className='noData' alt='nodata' />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="8" className="noDataText">
                                                No Data Found!
                                            </td>
                                        </tr>
                                    </>
                                    :
                                    myTasks.map((e) => (
                                        <tr key={e._id}>
                                            <td>{e.title}</td>
                                            <td>{e.descriptions}</td>
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
                                                <i onClick={() => showDeleteTaskModal(e._id)} class="bi bi-trash-fill"></i>
                                                <i onClick={() => { getEditTaskDetail(e._id); }} class="bi bi-pencil-square"></i>
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
            </div>

            {/* Add Tasks Model */}
            <>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton />
                    <h3 className='text-center'>Add Incident</h3>
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

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Department Name</Form.Label>
                                    <input value={task.deptName} onChange={handleChange} name='deptName' type='text' className='form-control mb-3 inputBox startDate' />
                                </div>

                                <div>
                                    <Form.Label>Department Number</Form.Label>
                                    <input value={task.deptNumber} onChange={handleChange} name='deptNumber' type='number' className='form-control mb-3 inputBox dueDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Department Name</Form.Label>
                                    <input value={task.deptName} onChange={handleChange} name='deptName' type='text' className='form-control mb-3 inputBox startDate' />
                                </div>

                                <div>
                                    <Form.Label>Department Number</Form.Label>
                                    <input value={task.deptNumber} onChange={handleChange} name='deptNumber' type='number' className='form-control mb-3 inputBox dueDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <div>
                                    <Form.Label>Start Date</Form.Label>
                                    <input value={task.startDate} onChange={handleChange} name='startDate' type='date' className='form-control mb-3 inputBox startDate' />
                                </div>

                                <div>
                                    <Form.Label>Due Date</Form.Label>
                                    <input value={task.dueDate} onChange={handleChange} name='dueDate' type='date' className='form-control mb-3 inputBox dueDate' />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Form.Label>Status</Form.Label>
                                    <select value={task.status} name="status" onChange={handleChange} type='text' className="form-select mb-3 inputBox statusBox">
                                        <option>Start</option>
                                        <option>Ongoing</option>
                                        <option>Done</option>
                                        <option>On hold</option>
                                    </select>
                                </div>

                                <div>
                                    <Form.Label>Priority</Form.Label>
                                    <select value={task.priority} name='priority' onChange={handleChange} type='text' className="form-select mb-3 inputBox priorityBox">
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
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
                        <Button className='closeBtn' onClick={addTaskAndClose}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>


                {/* Show Details Model */}

                <Modal show={view} onHide={handleViewClose}>
                    <Modal.Header closeButton />
                    <h3 className='text-center'>Incident Details</h3>
                    <Modal.Body><b>Title :</b> {viewDetail && viewDetail.title}</Modal.Body>
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
                    <h3 className='text-center'>Edit Incident</h3>
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
                            <select value={editDetail.status} name="status" onChange={handleEditChange} type='text' className="form-select mb-3 inputBox">
                                <option>Start</option>
                                <option>Ongoing</option>
                                <option>Done</option>
                                <option>On hold</option>
                            </select>

                            <Form.Label>Priority</Form.Label>
                            <select value={editDetail.priority} name='priority' onChange={handleEditChange} type='text' className="form-select mb-3 inputBox">
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

export default Dashboard;



import React from "react";
import { Modal, Button, Table } from 'react-bootstrap';

const TaskDetailModal = ({ view, handleViewClose, viewDetail }) => {
    function convertDate(newDate) {
        if (!newDate) {
            return
        }
        const parts = newDate.split('-');
        const newDateFormate = parts[2] + '-' + parts[1] + '-' + parts[0];
        // console.log(newDateFormate);
        return newDateFormate;
    }

    return (
        <Modal show={view} onHide={handleViewClose}>
            <Modal.Header closeButton>
                <Modal.Title className="text-center">Task Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {viewDetail && (
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td><b>Title</b></td>
                                <td>{viewDetail.title}</td>
                            </tr>
                            <tr>
                                <td><b>Department Name</b></td>
                                <td>{viewDetail.deptName}</td>
                            </tr>
                            <tr>
                                <td><b>Department Email</b></td>
                                <td>{viewDetail.deptEmail}</td>
                            </tr>
                            <tr>
                                <td><b>Department Number</b></td>
                                <td>{viewDetail.deptNumber}</td>
                            </tr>
                            <tr>
                                <td><b>Assigned To</b></td>
                                <td>{viewDetail.assignedTo}</td>
                            </tr>
                            <tr>
                                <td><b>Remark</b></td>
                                <td>{viewDetail.remark}</td>
                            </tr>
                            <tr>
                                <td><b>Description</b></td>
                                <td>{viewDetail.descriptions}</td>
                            </tr>
                            <tr>
                                <td><b>Start Date</b></td>
                                <td>{convertDate(viewDetail.startDate)}</td>
                            </tr>
                            <tr>
                                <td><b>End Date</b></td>
                                <td>{convertDate(viewDetail.dueDate)}</td>
                            </tr>
                            <tr>
                                <td><b>Priority</b></td>
                                <td>{viewDetail.priority}</td>
                            </tr>
                            <tr>
                                <td><b>Status</b></td>
                                <td>{viewDetail.status}</td>
                            </tr>
                            <tr>
                                <td><b>Created At</b></td>
                                <td>{new Date(viewDetail.createdAt).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><b>Updated At</b></td>
                                <td>{new Date(viewDetail.updatedAt).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className="closeBtn" onClick={handleViewClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskDetailModal;
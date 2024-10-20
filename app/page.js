"use client";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Table,
  Space,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Modal,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const TaskManagement = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const data = [
    {
      title: "complete assignment",
      priority: "High",
      description: "Complete by tomorrow morning at 10 AM",
      status: "Completed",
    },
    {
      title: "Task Enhancement",
      priority: "Low",
      description: "Will start after complete assignment",
      status: "Pending",
    },
  ];

  const columns = [
    {
      title: "S. No.",
      dataIndex: "index",
      key: "index",
      width: 100,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 180,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (val, row, index) => {
        return (
          <Space>
            <Switch
              checked={val === "Completed"}
              onChange={() => {
                handleToggle(index);
              }}
            />
            <Text>{val}</Text>
          </Space>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "index",
      key: "index",
      width: 180,
      render: (val, row, index) => {
        return (
          <Space>
            <Button
              color="primary"
              variant="outlined"
              icon={<EditOutlined />}
              onClick={() => {
                handleEdit(val, row, index);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                handleDelete(index);
              }}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    let taskList = localStorage.getItem("data");
    let taskData = JSON.parse(taskList);
    localStorage.setItem("data", JSON.stringify(taskData));
    setTableData(JSON.parse(taskList));
  }, []);

  const handleEdit = (val, row, index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
    const task = getTaskList();
    let selectedData = task[index];
    form.setFields([
      {
        name: "edit_title",
        value: selectedData?.title,
      },
      {
        name: "edit_description",
        value: selectedData?.description,
      },
      {
        name: "edit_priority",
        value: selectedData?.priority,
      },
      {
        name: "edit_status",
        value: selectedData?.status,
      },
    ]);
  };

  const getTaskList = () => {
    let taskData = localStorage.getItem("data");
    let parseData = JSON.parse(taskData);
    return parseData;
  };

  const updateTaskList = (task) => {
    localStorage.setItem("data", JSON.stringify(task));
    let taskList = localStorage.getItem("data");
    setTableData(JSON.parse(taskList));
  };

  const handleToggle = (index) => {
    const allTask = getTaskList();
    allTask.splice(index, 1, {
      ...allTask[index],
      status: allTask[index].status === "Completed" ? "Pending" : "Completed",
    });
    updateTaskList(allTask);
  };

  const handleDelete = (index) => {
    const allTask = getTaskList();
    allTask.splice(index, 1);
    updateTaskList(allTask);
  };

  const handleFinish = (values) => {
    const parseData = getTaskList();
    parseData.push({ ...values, status: "Pending" });
    updateTaskList(parseData);
    form.resetFields();
  };

  const handleModal = () => {
    setIsModalOpen((prev) => !prev);
    form.resetFields();
  };
  const handleModalFinish = (values) => {
    const { edit_title, edit_description, edit_priority, edit_status } = values;
    const formData = {
      title: edit_title,
      description: edit_description,
      priority: edit_priority,
      status: edit_status,
    };
    const parseData = getTaskList();
    parseData.splice(selectedIndex, 1, formData);
    updateTaskList(parseData);
    form.resetFields();
    handleModal();
  };

  return (
    <Row justify="space-between" gutter={[16, 16]}>
      <Col span={24}>
        <Card style={{ background: "rgb(22 78 99)" }}>
          <Row justify="center">
            <Col>
              <Text strong style={{ color: "white", fontSize: 25 }}>
                Task Management
              </Text>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24} style={{ padding: 16 }}>
        <Card title="Add Task">
          <Form
            name="CreateTask"
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Form.Item label="Title" name="title">
                  <Input placeholder="Enter task title" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Description" name="description">
                  <Input placeholder="Enter task description" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Priority" name="priority">
                  <Select
                    placeholder="Select task priority"
                    options={[
                      { label: "Low", value: "Low" },
                      { label: "Medium", value: "Medium" },
                      { label: "High", value: "High" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button
                    icon={<PlusOutlined />}
                    style={{ marginTop: 30, width: 150 }}
                    type="primary"
                    onClick={() => form.submit()}
                  >
                    Add Task
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <Table
          style={{ padding: 16 }}
          dataSource={tableData}
          columns={columns}
          pagination={false}
        ></Table>
      </Col>
      {isModalOpen && (
        <Modal
          title="Edit Task"
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={handleModal}
        >
          <Form
            name="updateTask"
            form={form}
            layout="vertical"
            onFinish={handleModalFinish}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Title"
                  name="edit_title"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Enter task title" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="edit_description"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Enter task description" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Priority"
                  name="edit_priority"
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="Select task priority"
                    options={[
                      { label: "Low", value: "Low" },
                      { label: "Medium", value: "Medium" },
                      { label: "High", value: "High" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  hidden
                  label="Status"
                  name="edit_status"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Enter task description" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </Row>
  );
};

export default TaskManagement;

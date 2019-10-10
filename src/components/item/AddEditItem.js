import React, { useState } from 'react';
import { Form, Modal, Select, Input, InputNumber, Upload, Icon, Spin, Alert, message } from 'antd';
import { KEG_SIZES } from '../../utils/constants';
import { getBase64, S3Image } from '../../utils/utils';
import { createOrUpdateItem } from './helper';

const defaultItem = {
    name: '',
    description: '',
    amount_per_unit: '',
    quantity_per_order: 1,
    order_by: '',
    style: '',
    sku: '',
    price: '',
    alcohol_percentage: ''
}

const AddEditItem = ({ refreshItems, handleClose, form, item=defaultItem }) => {

    const { getFieldDecorator, validateFields, setFieldsValue } = form;
    const [orderBy, setOrderBy] = useState(item.order_by || '')
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const editing = !!item.id

    const handleAddItem = e => {
        e.preventDefault();
        setLoading(true);
        validateFields((err, values) => {
            const data = {
                ...item,
                ...values,
                base64_image: imageUrl.split(',')[1],
                image: ''
            }
            createOrUpdateItem(data).then(res => {
                editing 
                    ? message.success('Your item is updated')
                    : message.success('Nice! You just created a new item')
                refreshItems();
                handleClose();
            })
            .catch(err => setError(true))
            .finally(() => setLoading(false));
        })
    }

    const handleImageChange = info => {
            getBase64(info.file.originFileObj, url => setImageUrl(url))
    }

    const handleOrderByChange = value => {
        setFieldsValue({
            amount_per_unit: 30000
        });
        setOrderBy(value);
    };

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

    return (
        <Modal
            title={editing ? `Edit ${item.name}` : 'Add an item to your inventory'}
            visible
            onOk={handleAddItem}
            onCancel={handleClose}
            centered
            okText="Save"
        >
            <Spin tip="Creating item..." spinning={loading} >
                <Form onSubmit={handleAddItem} {...formItemLayout}>
                    <Form.Item label="Name">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: 'Please enter a name for your item'}]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Description">
                        {getFieldDecorator('description')(
                            <Input.TextArea placeholder="Describe this product" />
                        )}
                    </Form.Item>
                    <Form.Item label="Order by">
                        {getFieldDecorator('order_by', {
                            rules: [{required: true, message: 'Please select how your item will be ordered'}]
                        })(<Select onChange={handleOrderByChange}>
                            <Select.Option key={0} value="Keg">Keg</Select.Option>
                            <Select.Option key={1} value="Case">Case</Select.Option>
                            <Select.Option key={2} value="Bottle">Bottle</Select.Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="Sku">
                        {getFieldDecorator('sku', {
                            rules: [{required: true, message: 'Please give your item a unique SKU'}]
                        })(<Input style={{width: 120}} />)}
                    </Form.Item>
                    <Form.Item label="Price">
                        {getFieldDecorator('price', {
                            rules: [{required: true, message: 'Please specify a valid price for your item'}]
                        })(<InputNumber 
                                formatter={value => `$ ${value}`}
                                min={0}
                            />)}
                    </Form.Item>
                    {orderBy === 'Keg' &&
                        <Form.Item label="Keg size">
                            {getFieldDecorator('amount_per_unit', {
                                rules: [{required: true, message: 'Please select a keg size'}]
                            })(<Select style={{width: 80}}>
                                {KEG_SIZES.map(size => <Select.Option value={size*1000}>{size}L</Select.Option>)}
                            </Select>)}
                        </Form.Item>
                    }
                    {orderBy === 'Case' &&
                        <Form.Item label="Quantity per case">
                            {getFieldDecorator('quantity_per_order', {
                                rules: [{required: true, message: 'Please enter a valid case size'}]
                            })(<InputNumber
                                min={0}
                            />)}
                        </Form.Item>
                    }
                    {orderBy !== 'Keg' &&
                        <Form.Item label="Amount per unit">
                            {getFieldDecorator('amount_per_unit', {
                                rules: [{required: true, message: 'Please enter a valid unit size'}]
                            })(<InputNumber
                                min={0}
                            />)} mL
                        </Form.Item>
                    }
                    <Form.Item label="Style">
                        {getFieldDecorator('style')(<Input placeholder="IPA, Ale, Blonde, Lager..." />)}
                    </Form.Item>
                    <Form.Item label="Alcohol percentage">
                        {getFieldDecorator('alcohol_percentage', {
                            rules: [{required: true, message: 'Please specify a valid alcohol percentage'}]
                        })(<InputNumber 
                                formatter={value => `${value} %`}
                                min={0}
                                max={100}
                        />)}
                    </Form.Item>
                    <Form.Item label="Image">
                        {getFieldDecorator('image', {
                            rules: [{required: false, message: 'Please provide an image of your product'}]
                        })(
                            <Upload.Dragger name="image"  multiple={false} onChange={handleImageChange}>
                                {item.image || imageUrl 
                                    ? <img src={item.image && !imageUrl ? S3Image(item.image) : imageUrl} width="80" height="80" />
                                    : <React.Fragment>
                                        <p className="ant-upload-drag-icon"><Icon type="inbox" /></p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>   
                                    </React.Fragment>

                                }
                            </Upload.Dragger>,
                        )}
                    </Form.Item>
                </Form>
                {error && 
                    <Alert 
                        message="Error" 
                        description="There was a problem saving your changes" 
                        type="error" 
                        showIcon 
                    />
                }
            </Spin>
        </Modal>
    );
};

const WrappedAddItem = Form.create({
    name: 'add_item_form',
    mapPropsToFields: props => {
        if (props.item) {
            return {
                name: Form.createFormField({value: props.item.name}),
                description: Form.createFormField({value: props.item.description}),
                order_by: Form.createFormField({value: props.item.order_by}),
                sku: Form.createFormField({value: props.item.sku}),
                price: Form.createFormField({value: props.item.price}),
                amount_per_unit: Form.createFormField({value: props.item.amount_per_unit / (props.item.order_by === 'Keg' ? 1000 : 1)}),
                quantity_per_order: Form.createFormField({value: props.item.quantity_per_order}),
                style: Form.createFormField({value: props.item.style}),
                alcohol_percentage: Form.createFormField({value: props.item.alcohol_percentage}),
            }
        }
    }
})(AddEditItem);

export default WrappedAddItem;

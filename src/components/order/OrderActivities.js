import React, { useState, useEffect, useContext } from 'react';
import { Comment, Avatar, Form, Button, List, Input, Tag } from 'antd';
import { StoreContext } from '../../context/store';
import Image from '../common/Image';
import moment from 'moment';
import api from '../../utils/api';

const ActivityList = ({ activities }) => (
    <List
        dataSource={activities}
        header="Comments"
        itemLayout="horizontal"
        size="large"
        renderItem={props => (
            <Comment
                author={props.name}
                avatar={<Image src={props.image} width="50px" height="50px" />}
                content={
                    <div>
                        {props.activity && <Tag>{props.activity}</Tag>}
                        {props.message}
                    </div>
                }
                datetime={moment(props.created_at).fromNow()}
            />
        )}
    />
);

const AddActivity = ({ orderId, refreshOrder }) => {
    
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const { state } = useContext(StoreContext);

    const addActivity = () => {
        if (value) {
            setLoading(true);
            const payload = {
                message: value,
                order: orderId
            };
            if (state.account_type === 'supplier') {
                payload.supplier_seen = true;
            }
            else {
                payload.client_seen = true;
            }

            api.orderActivities.create(payload)
            .then(() => {
                refreshOrder();
                setValue('');
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
        }
    };

    return (
        <div style={{marginTop: 30}}>
            <Form.Item>
                <Input.TextArea 
                    rows={4} 
                    onChange={e => setValue(e.target.value)} 
                    value={value} 
                />
            </Form.Item>
            <Form.Item>
                <Button loading={loading} onClick={addActivity} type="primary">
                    Submit
                </Button>
            </Form.Item>
        </div>
    )
};


const OrderActivities = ({ refreshOrder, order }) => {

    useEffect(() => {
        api.markActivitiesSeen.create({order: order.id});
    }, [])

    return (
        <div style={{width: '100%'}}>
            <ActivityList activities={order.activities} />
            <AddActivity refreshOrder={refreshOrder} orderId={order.id} />
        </div>
    );
};

export default OrderActivities;
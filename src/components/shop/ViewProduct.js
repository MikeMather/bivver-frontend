import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Empty, Breadcrumb, Button, Typography, Icon, Descriptions, Tag, Badge, message } from 'antd';
import { Link } from 'react-router-dom';
import { StyledBanner } from './StoreBanner';
import { S3Image } from '../../utils/utils';
import moment from 'moment';
import styled from 'styled-components';
import AddToCartButton from './AddToCartButton';
import Image from '../common/Image';

const StyledTagContainer = styled.div`
    position: absolute;
    top: 50px;
    right: 50px;
`;

const StyledDetailsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
`;

const ViewProduct = ({ match }) => {

    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [supplier, setSupplier] = useState({})

    const fetchData = () => {
        api.products.publicRetrieve(match.params.itemId)
            .then(res => {
                setItem(res);
                api.supplierSearch.publicRetrieve(match.params.supplierId)
                    .then(s => setSupplier(s));  
            });
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <React.Fragment>
            {(!item.id && !loading) && 
                <Empty style={{height: '60vh'}} description="We couldn't find the item you were looking for">
                    <Link to={`/suppliers/${match.params.supplierId}`}><Button type="primary">Go to Store</Button></Link>
                </Empty>
            }
            {item.id &&
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to={`/suppliers/${item.supplier}`}>{supplier.name}</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
                    </Breadcrumb>
                    <StyledBanner>
                        <Image
                            src={item.image}
                            width="200px"
                            height="200px"
                        />
                        <div style={{flexBasis: '75%', marginLeft: 30}}>
                            <Typography.Title>{item.name}</Typography.Title>
                            <StyledTagContainer>
                                {item.discounted_price
                                    ? <Tag color="red" style={{fontSize: 16}}>On Sale</Tag>
                                    : (moment().subtract(30, 'days').isSameOrBefore(item.created_at) &&
                                        <Tag color="green" style={{fontSize: 16}}>New</Tag>
                                    )
                                }
                            </StyledTagContainer>
                            <div style={{minHeight: 60, marginBottom: 20}}><Typography.Text type="secondary">{item.description}</Typography.Text></div>
                            <StyledDetailsContainer>
                                <div>
                                    <div style={{display: 'flex', alignItems: 'baseline', width: 180}}>
                                        {item.discounted_price && <Typography.Text delete style={{marginRight: 15}}>{item.price}</Typography.Text>}
                                        <Typography.Title level={4}>${item.discounted_price || item.price}</Typography.Title>
                                    </div>
                                    {parseInt(item.stock_quantity) > 0 ? <Badge status="success" text="In stock" /> : <Badge status="error" text="Out of stock" />}
                                </div>
                                <AddToCartButton item={item} />
                            </StyledDetailsContainer>
                        </div>
                    </StyledBanner>
                    <Descriptions bordered column={{xs: 1, md: 3}}>
                        <Descriptions.Item label="Amount per unit">{item.amount_per_unit}</Descriptions.Item>
                        <Descriptions.Item label="Measure">{item.measure}</Descriptions.Item>
                        <Descriptions.Item label="Size">{item.order_by}</Descriptions.Item>

                        <Descriptions.Item label="Units per order">{item.quantity_per_order}</Descriptions.Item>
                        <Descriptions.Item span={2} label="SKU">{item.sku}</Descriptions.Item>

                        <Descriptions.Item span={3} label="Tasting notes">{item.tasting_notes}</Descriptions.Item>
                        <Descriptions.Item span={3} label="Serving Suggestions">{item.serving_suggestions}</Descriptions.Item>

                        <Descriptions.Item label="Alcohol Percentage">{parseFloat(item.alcohol_percentage).toFixed(2)}</Descriptions.Item>
                    </Descriptions>
                </div>
            }
        </React.Fragment>
    );
};

export default ViewProduct;
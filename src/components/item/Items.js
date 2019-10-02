import React, { useState, useEffect, useContext } from 'react';
import { List, Icon, Card, Button, Input, Dropdown, Menu, Radio, Skeleton, Result, Popover, Alert } from 'antd';
import api from '../../utils/api';
import { StoreContext } from '../../context/store';
import styled from 'styled-components';
import { getFilteredItems } from './helper';
import AddEditItem from './AddEditItem';
import Item from './Item';

const FiltersContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;

    div {
        margin-bottom: 10px;
    }
`;


const Items = () => {

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([])
    const [loading, setLoading] = useState(false);
    const { state } = useContext(StoreContext);
    const [filters, setFilters] = useState({search: '', orderBy: ''});
    const [addItem, setAddItem] = useState(false);

    const fetchItems = () => {
        setLoading(true);
        api.items.getAll({supplier: state.supplier.id})
            .then(res => {
                setItems(res);
                setFilteredItems(getFilteredItems(res, filters));
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (state.supplier) {
            fetchItems();
        }
    }, [state])

    useEffect(() => {
        setFilteredItems(getFilteredItems(items, filters));
    }, [filters])

    const FilterMenu = () => {
        const radioStyle = {
            display: 'block',
            marginTop: 5
        };

        return (
            <Menu style={{width: 120}}>
                <Radio.Group 
                    onChange={e => setFilters({...filters, orderBy: e.target.value})} 
                    value={filters.orderBy}
                    style={{marginRight: 5, marginLeft: 5, marginTop: 5}}
                >
                    <Radio value={'Keg'} style={radioStyle}>Kegs</Radio>
                    <Radio value={'Case'} style={radioStyle}>Cases</Radio>
                    <Radio value={'Bottle'} style={radioStyle}>Bottles</Radio>
                </Radio.Group>
                <Menu.Item><Button type="link" onClick={() => setFilters({...filters, orderBy: ''})}>Clear</Button></Menu.Item>
            </Menu>
        );
    }

    const AddItemButton = () => <Button type="primary" onClick={() => setAddItem(true)}>Add <Icon type="plus" /></Button>;

    return (
        <div>
            {addItem && <AddEditItem handleClose={() => setAddItem(false)} refreshItems={fetchItems} />}
            <FiltersContainer>
                <div>
                    <Input.Search
                        onSearch={value => setFilters({...filters, search: value})}
                        style={{width: 250, marginRight: 16}}
                    />
                    <Dropdown overlay={FilterMenu}><Button>Filter <Icon type="down" /></Button></Dropdown>
                </div>
                {(!loading && !items.length)
                    ? <Popover 
                        visible={!items.length && !addItem}
                        style={{xIndex: 1}}
                        content={<Alert type="info" message={<p><b>Welcome to Bivver!</b> To get started, add some of your products using this button</p>} />} 
                        style={{width: 120}}
                        placement="left"
                    >
                        <AddItemButton />
                    </Popover>
                    : <AddItemButton />
                }
                
            </FiltersContainer>
            <Card>
                {loading && 
                    <List
                        loading={loading}
                        itemLayout="vertical"
                        size="large"
                        dataSource={[<Skeleton avatar paragraph={{rows: 3}} />, <Skeleton avatar paragraph={{rows: 3}} />, <Skeleton avatar paragraph={{rows: 3}} />]}
                        renderItem={item => item}
                    />
                }
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={filteredItems}
                    renderItem={item => <Item item={item} refreshItems={fetchItems} />}
                />
            </Card>
        </div>
    );
};

export default Items;
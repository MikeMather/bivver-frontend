import api from '../../utils/api';

export const getFilteredItems = (items, filters) => {
    let filteredItems = [...items];
    if (filters.search) {
        filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.orderBy) {
        filteredItems = filteredItems.filter(item => item.order_by === filters.orderBy);
    }
    return filteredItems;
}

export const createOrUpdateItem = item => {
    if (item.id) {
        return api.items.update(item.id, item);
    }
    return api.items.create(item);
}
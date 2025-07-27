(() => {
  /**
   * @mixin StoreMixinSelection
   */
  const StoreMixinSelection = {
    selectRowItem(item, value = true) {
      const me = this;
      const group = item.$rowGroupValue;

      item.$selected = value;
      me.updateSelectedItemsMap(value, item);

      if (group) {
        me.updateSelectedRowGroupsChildren(group, value, item);
        me.updateSelectedStatus(group);

        const splitted = group.split('/');
        const iL = splitted.length;

        for (let i = 0; i < iL - 1; i++) {
          const _group = splitted.join('/');
          const groupDetail = me.groupDetails[_group];
          const groupItem = me.idItemMap.get(groupDetail.id);
          splitted.pop();
          const parentGroup = splitted.join('/');

          if(value || !groupItem.selectedStatus) me.updateSelectedRowGroupsChildren(parentGroup, value, groupItem);
          me.updateSelectedStatus(parentGroup);
        }
      }
    },
    updateGroupsChildrenSelection(group, value) {
      const me = this;
      const children = me.filters.length ? me.groupsChildrenForFiltering[group] : me.groupsChildren[group] ;

      children.forEach(childItem => {
        childItem.$selected = value;

        !childItem.$isGroupRow && me.updateSelectedItemsMap(value, childItem);
        me.updateSelectedRowGroupsChildren(group, value, childItem);

        const childGroup = childItem.$rowGroupValue;

        if (childItem.$isGroupRow) {
          if (value) {
            childItem.selectedStatus = 'full';
          } else {
            childItem.selectedStatus = false;
          }
          me.updateGroupsChildrenSelection(childGroup, value);
        }
      });
    },
    selectGroupRowItems(item, value = true) {
      const me = this;
      const group = item.$rowGroupValue;

      item.$selected = value;
      item.selectedStatus = value? 'full' : false;

      !item.$isGroupRow && me.updateSelectedItemsMap(value, item);
      me.updateGroupsChildrenSelection(group, value);
      me.updateSelectedStatus(group);

      const splitted = group.split('/');
      const iL = splitted.length;

      for (let i = 0; i < iL - 1; i++) {
        const _group = splitted.join('/');
        const groupDetail = me.filters.length? me.groupDetailsForFiltering[_group] : me.groupDetails[_group];
        const groupItem = me.idItemMap.get(groupDetail.id);
        splitted.pop();
        const parentGroup = splitted.join('/');

        me.updateSelectedRowGroupsChildren(parentGroup, value, groupItem);
        me.updateSelectedStatus(parentGroup);
      }
    },
    updateSelectedItemsMap(value, item) {
      const me = this;

      item.$isGroupRow && console.warn('FG-Grid: It is wrong to use selectedItemsMap for group row. Only for items that do not have children.');

      if (value) {
        me.selectedItemsMap.set(item.id, item);
      } else {
        me.selectedItemsMap.delete(item.id);
      }
    },
    updateSelectedRowGroupsChildren(group, value, item) {
      const me = this;
      const children = me.selectedRowGroupsChildren;

      if (value) {
        if (children[group] === undefined) {
          children[group] = new Set();
        }
        children[group].add(item.id);
      } else if (children[group]) {
        children[group].delete(item.id);
        if (children[group].size === 0) delete children[group];
      }
    },
    updateSelectedStatus(group) {
      const me = this;
      const groupDetails = me.filters.length ? me.groupDetailsForFiltering : me.groupDetails;
      const groupsChildren = me.filters.length ? me.groupsChildrenForFiltering : me.groupsChildren;
      const groupDetail = groupDetails[group];
      const groupItem = me.idItemMap.get(groupDetail.id);

      let groupSelectedStatus;

      if (!me.selectedRowGroupsChildren[group]) {
        groupSelectedStatus = false;
        groupItem.$selected = false;
        me.selectedItemsMap.delete(groupDetail.id);
      } else if (groupsChildren[group].length === me.selectedRowGroupsChildren[group].size) {
        let childIsPartlySelected = false;
        if(groupItem.$hasChildrenGroups){
          const groupChildren = groupsChildren[group];
          for(let i = 0;i<groupChildren.length;i++){
            const subGroupItem = groupChildren[i];
            if(subGroupItem.selectedStatus === 'partly'){
              childIsPartlySelected = true;
              break;
            }
          }
        }

        if(childIsPartlySelected){
          groupSelectedStatus = 'partly';
          delete groupItem.$selected;
        }
        else{
          groupSelectedStatus = 'full';
          groupItem.$selected = true;
        }
        //me.updateSelectedRowGroupsChildren()
      } else {
        groupSelectedStatus = 'partly';
        delete groupItem.$selected;
      }

      groupDetails[group].selectedStatus = groupSelectedStatus;
    },
    selectAll(value = true) {
      const me = this;
      const groupsChildren = me.filters.length ? me.groupsChildrenForFiltering : me.groupsChildren;
      const groupDetails = me.filters.length ? me.groupDetailsForFiltering : me.groupDetails;

      if (value) {
        for (const group in groupsChildren) {
          const children = groupsChildren[group];
          const groupDetail = groupDetails[group];

          if (!groupDetail) {
            // TODO: fix case with '' group
            // Maybe it is root group
            continue;
          }

          groupDetail.selectedStatus = 'full';
          groupDetail.$selected = true;

          children.forEach(item => {
            me.updateSelectedRowGroupsChildren(group, true, item);
          });
        }

        me.data.forEach(item => {
          item.$selected = true;
          me.selectedItemsMap.set(item.id, item);
        });
      } else {
        for (const group in groupsChildren) {
          const children = groupsChildren[group];
          const groupDetail = groupDetails[group];

          if (!groupDetail) {
            // TODO: fix case with '' group
            // Maybe it is root group
            continue;
          }

          groupDetail.selectedStatus = false;
          delete groupDetail.$selected;

          children.forEach(item => {
            me.updateSelectedRowGroupsChildren(group, false, item);
          });
        }

        me.data.forEach(item => {
          delete item.$selected;
          me.selectedItemsMap.delete(item.id);
        });
      }
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinSelection);
})();

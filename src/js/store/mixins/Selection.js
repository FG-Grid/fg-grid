(()=> {

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

          if(value || !groupItem.selectedStatus){
            me.updateSelectedRowGroupsChildren(parentGroup, value, groupItem);
          }
          me.updateSelectedStatus(parentGroup);
        }
      }
    },

    updateGroupsChildrenSelection(group, value) {
      const me = this;

      me.groupsChildren[group].forEach(childItem => {
        childItem.$selected = value;

        if (!childItem.$isGroupRow) {
          me.updateSelectedItemsMap(value, childItem);
        }
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
      if (value) {
        item.selectedStatus = 'full';
      } else {
        item.selectedStatus = false;
      }

      if (!item.$isGroupRow) {
        me.updateSelectedItemsMap(value, item);
      }
      me.updateGroupsChildrenSelection(group, value);
      me.updateSelectedStatus(group);

      const splitted = group.split('/');
      const iL = splitted.length;

      for (let i = 0; i < iL - 1; i++) {
        const _group = splitted.join('/');
        const groupDetail = me.groupDetails[_group];
        const groupItem = me.idItemMap.get(groupDetail.id);
        splitted.pop();
        const parentGroup = splitted.join('/');

        me.updateSelectedRowGroupsChildren(parentGroup, value, groupItem);
        me.updateSelectedStatus(parentGroup);
      }
    },

    updateSelectedItemsMap(value, item) {
      const me = this;

      if (item.$isGroupRow) {
        console.warn('It is wrong to use selectedItemsMap for group row. Only for items that do not have children.');
      }

      if (value) {
        me.selectedItemsMap.set(item.id, item);
      } else {
        me.selectedItemsMap.delete(item.id);
      }
    },

    updateSelectedRowGroupsChildren(group, value, item) {
      const me = this;
      const selectedRowGroupsChildren = me.selectedRowGroupsChildren;

      if (value) {
        if (selectedRowGroupsChildren[group] === undefined) {
          selectedRowGroupsChildren[group] = new Set();
        }
        selectedRowGroupsChildren[group].add(item.id);
      } else if (selectedRowGroupsChildren[group]) {
        selectedRowGroupsChildren[group].delete(item.id);
        if (selectedRowGroupsChildren[group].size === 0) {
          delete selectedRowGroupsChildren[group];
        }
      }
    },

    updateSelectedStatus(group) {
      const me = this;
      const groupDetail = me.groupDetails[group];
      const groupItem = me.idItemMap.get(groupDetail.id);

      let groupSelectedStatus;

      if (!me.selectedRowGroupsChildren[group]) {
        groupSelectedStatus = false;
        groupItem.$selected = false;
        me.selectedItemsMap.delete(groupDetail.id);
      } else if (me.groupsChildren[group].length === me.selectedRowGroupsChildren[group].size) {
        let childIsPartlySelected = false;
        if(groupItem.$hasChildrenGroups){
          const groupChildren = me.groupsChildren[group];
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

      me.groupDetails[group].selectedStatus = groupSelectedStatus;
    },

    selectAll(value = true) {
      const me = this;

      if (value) {
        for (const group in me.groupsChildren) {
          const children = me.groupsChildren[group];
          const groupDetail = me.groupDetails[group];

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
        for (const group in me.groupsChildren) {
          const children = me.groupsChildren[group];
          const groupDetail = me.groupDetails[group];

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
  }

  Object.assign(Fancy.Store.prototype, StoreMixinSelection);
})();

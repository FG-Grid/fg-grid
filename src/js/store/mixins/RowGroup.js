/*
  levelsWithGroups sample structure
  [
    [{
      'root': ['Germany', 'UK', 'Japan', 'USA']
    }],
    [{
      'Germany': ['Germany/BMW', 'Germany/Audi', 'Germany/VW'],
      'UK': ['UK/Land Rover', 'UK/Jaguar'],
      'Japan': ['Japan/Toyota', 'Japan/Mazda', 'Japan/Lexus'],
      'USA': ['USA/Ford']
    }],
    [{
      'Germany/BMW': ['Germany/BMW/X1', 'Germany/BMW/X2', 'Germany/BMW/X7'],
      'Germany/Audi': ['Germany/Audi/A3', 'Germany/Audi/A4', 'Germany/Audi/Q5', 'Germany/Audi/Q7'],
      'Germany/VW': ['Germany/VW/Teramont', 'Germany/VW/Tiguan', 'Germany/VW/Polo', 'Germany/VW/Tuareg'],
      'UK/Land Rover': ['UK/Land Rover/Land Rover Sport'],
      'UK/Jaguar': ['UK/Jaguar/F-Pace', 'UK/Jaguar/E-Pace', 'UK/Jaguar/E-Type'],
      'Japan/Toyota': ['Japan/Toyota/Camry', 'Japan/Toyota/Land Cruiser', 'Japan/Toyota/Prado', 'Japan/Toyota/HighLander'],
      'Japan/Mazda': ['Japan/Mazda/CX-5', 'Japan/Mazda/CX-9', 'Japan/Mazda/6'],
      'Japan/Lexus': ['Japan/Lexus/RX 350', 'Japan/Lexus/NX', 'Japan/Lexus/NX 300', 'Japan/Lexus/RX'],
      'USA/Ford': ['USA/Ford/F-150', 'USA/Ford/Explorer']
    }]
  ]
*/
(() => {
  /**
   * @mixin StoreMixinRowGroup
   */
  const StoreMixinRowGroup = {
    rowGroupData() {
      const me = this;

      me.set$rowGroupValue();
      me.setExpandedGroups();
      me.generateGroupDetails();
      me.sortGroups();
      me.generateDisplayedGroupedData();
    },
    rowGroupDataForFiltering() {
      this.generateGroupDetailsForFiltering();
    },
    generateDisplayedGroupedData() {
      const me = this;
      // Possible bug
      // Every time resort groups by amount
      const displayedGroupsSorted = me.getSortedDisplayedGroups();
      let groupedData = [];

      displayedGroupsSorted.forEach(group => {
        const groupChildren = me.groupsChildren[group];
        const groupDetails = me.groupDetails[group];
        const expanded = me.expandedGroups[group] || false;

        groupedData.push(groupDetails);

        // Group that does not have groups
        // This group has children that are real data
        if (!groupDetails.$hasChildrenGroups && expanded) {
          groupedData = groupedData.concat(groupChildren);
        }
      });

      me.displayedData = groupedData;
    },
    // Regenerate display group data
    // It is only for case when there are no sorters
    simpleReGenerateDisplayedGroupedData() {
      const me = this;
      const groupedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildren) {
        if (me.isParentCollapsed(group)) continue;

        const groupData = me.groupsChildren[group].slice();
        const groupDetails = me.groupDetails[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

        groupedData.splice(rowIndex + 1, groupData.length, ...groupData);
      }

      me.displayedData = groupedData;
    },
    generateDisplayedGroupedDataForFiltering(doNotSort = false) {
      const me = this;
      let displayedGroupsSorted = [];
      let groupedData = [];

      if (!doNotSort) {
        displayedGroupsSorted = me.getSortedDisplayedGroupsForFiltering();

        displayedGroupsSorted.forEach(group => {
          const groupChildren = me.groupsChildrenForFiltering[group];
          const groupDetails = me.groupDetailsForFiltering[group];
          const expanded = me.expandedGroups[group] || false;

          groupedData.push(groupDetails);

          // Group that does not have groups
          // This group has children that are real data
          if (!groupDetails.$hasChildrenGroups && expanded) {
            groupedData = groupedData.concat(groupChildren);
          }
        });
      } else {
        groupedData = me.getGroupDataForFiltering();
      }

      me.displayedData = groupedData;
    },
    /*
     Generates groupsChildren, groupDetails, levelsWithGroups
     */
    generateGroupDetails(groupNames, groupLevel) {
      const me = this;
      const parentGroups = {};
      let hasChildrenGroups = true;

      if (groupNames === undefined) {
        me.groupsChildren = me.groupsChildren || Object.groupBy(me.data, row => row.$rowGroupValue);
        groupNames = Object.keys(me.groupsChildren);
        groupLevel = me.rowGroups.length - 1;
        hasChildrenGroups = false;
        me.groupDetails = {};
        me.levelsWithGroups = [
          [{
            root: []
          }]
        ];
        me.expandedGroupsWithDataChildren = {};
      }

      groupNames.forEach(groupName => {
        const splitted = groupName.split('/');
        const rowDisplayGroupValue = splitted.pop();
        let parentGroupName = 'root';

        if (groupLevel !== 0) {
          parentGroupName = splitted.join('/');
          parentGroups[parentGroupName] = true;
        }

        const parentGroup = splitted.join('/');
        const expanded = me.expandedGroups[groupName] || false;

        me.groupsChildren[parentGroup] = me.groupsChildren[parentGroup] || [];
        me.levelsWithGroups[groupLevel] = me.levelsWithGroups[groupLevel] || [{}];
        me.levelsWithGroups[groupLevel][0][parentGroupName] = me.levelsWithGroups[groupLevel][0][parentGroupName] || [];
        me.levelsWithGroups[groupLevel][0][parentGroupName].push(groupName);

        const groupDetails = {
          $rowGroupValue: groupName,
          $rowDisplayGroupValue: rowDisplayGroupValue,
          $groupLevel: groupLevel,
          $isGroupRow: true,
          $hasChildrenGroups: hasChildrenGroups,
          id: me.generateId(),
          childrenAmount: me.groupsChildren[groupName].length,
          expanded,
          $agValues: {}
        };

        if (!hasChildrenGroups) {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildren[groupName].map(rowData => rowData[aggregation.index]);
            groupDetails.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupDetails.amount = groupDetails.childrenAmount;

          if (groupDetails.expanded) {
            me.expandedGroupsWithDataChildren[groupName] = true;
          }
        } else {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildren[groupName].map(groupData => groupData.$agValues[aggregation.index]);
            groupDetails.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupDetails.amount = me.groupsChildren[groupName].reduce((sum, child) => sum + child.amount, 0);
        }

        me.groupDetails[groupName] = groupDetails;
        if (groupLevel !== 0) me.groupsChildren[parentGroup].push(groupDetails);
      });

      if (groupLevel !== 0) {
        const parentGroupNames = Object.keys(parentGroups);
        me.generateGroupDetails(parentGroupNames, groupLevel - 1);
      }

      for(let i = 0;i<groupNames.length;i++) {
        const groupName = groupNames[i];
        const groupDetails = me.groupDetails[groupName];
        if(!groupDetails.$hasChildrenGroups) break;

        const children = me.groupsChildren[groupName];
        const childrenSorted = children.sort((groupA, groupB) => {
          switch (me.defaultRowGroupSort) {
            case 'asc-string': return groupA.$rowDisplayGroupValue.localeCompare(groupB.$rowDisplayGroupValue);
            case 'desc-string': return groupB.$rowDisplayGroupValue.localeCompare(groupA.$rowDisplayGroupValue);
            case 'asc-amount': return groupA.amount - groupB.amount;
            case 'desc-amount': return groupB.amount - groupA.amount;
          }
        });
        me.groupsChildren[groupName] = childrenSorted;
      }
    },
    generateGroupDetailsForFiltering(groupNames, groupLevel) {
      const me = this;
      const parentGroups = {};
      let hasChildrenGroups = true;

      if (groupNames === undefined) {
        me.groupsChildrenForFiltering = Object.groupBy(me.filteredData, row => row.$rowGroupValue);
        groupNames = Object.keys(me.groupsChildrenForFiltering);
        groupLevel = me.rowGroups.length - 1;
        hasChildrenGroups = false;
        me.groupDetailsForFiltering = {};
        me.levelsWithGroupsForFiltering = [];
        me.expandedGroupsWithDataChildrenForFiltering = {};
      }

      groupNames.forEach(groupName => {
        const groupDetails = me.groupDetails[groupName];
        const splitted = groupName.split('/');
        const rowDisplayGroupValue = splitted.pop();
        let parentGroupName = 'root';

        if (groupLevel !== 0) {
          parentGroupName = splitted.join('/');
          parentGroups[parentGroupName] = true;
        }

        const parentGroup = splitted.join('/');
        const expanded = me.expandedGroups[groupName] || false;

        if (parentGroup === '') {
          // TODO: fix case with '' group
          // Maybe it is root group
        }

        me.groupsChildrenForFiltering[parentGroup] = me.groupsChildrenForFiltering[parentGroup] || [];
        me.levelsWithGroupsForFiltering[groupLevel] = me.levelsWithGroupsForFiltering[groupLevel] || [{}];
        me.levelsWithGroupsForFiltering[groupLevel][0][parentGroupName] = me.levelsWithGroupsForFiltering[groupLevel][0][parentGroupName] || [];
        me.levelsWithGroupsForFiltering[groupLevel][0][parentGroupName].push(groupName);

        if (!groupDetails) console.error(`FG-Grid: groupDetails does not contain ${groupName}`);

        const groupDetailsForFiltering = {
          $rowGroupValue: groupName,
          $rowDisplayGroupValue: rowDisplayGroupValue,
          $groupLevel: groupLevel,
          $isGroupRow: true,
          $hasChildrenGroups: hasChildrenGroups,
          id: groupDetails.id,
          childrenAmount: me.groupsChildrenForFiltering[groupName].length,
          expanded,
          $agValues: {}
        };

        if (!hasChildrenGroups) {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildrenForFiltering[groupName].map(rowData => rowData[aggregation.index]);
            groupDetailsForFiltering.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupDetailsForFiltering.amount = groupDetailsForFiltering.childrenAmount;

          if (groupDetailsForFiltering.expanded) {
            me.expandedGroupsWithDataChildrenForFiltering[groupName] = true;
          }
        } else {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildrenForFiltering[groupName].map(groupData => groupData.$agValues[aggregation.index]);
            groupDetailsForFiltering.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupDetailsForFiltering.amount = me.groupsChildrenForFiltering[groupName].reduce((sum, child) => sum + child.amount, 0);
        }

        me.groupDetailsForFiltering[groupName] = groupDetailsForFiltering;
        if (groupLevel !== 0) me.groupsChildrenForFiltering[parentGroup].push(groupDetailsForFiltering);
      });

      if (groupLevel === 0) {
        me.generateDisplayedGroupsForFiltering(groupNames);
      } else {
        const parentGroupNames = Object.keys(parentGroups);
        me.generateGroupDetailsForFiltering(parentGroupNames, groupLevel - 1);
      }
    },
    clearGroups() {
      const me = this;

      delete me.groupsChildren;
      delete me.levelsWithGroups;
      delete me.expandedGroupsWithDataChildren;

      me.data.forEach(rowData => delete rowData.$rowGroupValue);
    },
    set$rowGroupValue(data) {
      if (data === undefined) (data = this.data);

      data.forEach(rowData => {
        let $rowGroupValues = [];

        this.rowGroups.forEach(group => $rowGroupValues.push(rowData[group]));
        rowData.$rowGroupValue = $rowGroupValues.join('/');
      });

      return data;
    },
    // Runs only on start and on setData
    // rowGroupExpanded will be deleted
    // On resetting data, rowGroupData won't be used.
    setExpandedGroups() {
      const me = this;

      me.expandedGroups = {};

      switch(typeof me.rowGroupExpanded){
        case 'function':
        case 'boolean':
          const groupNames = Object.keys(Object.groupBy(me.data, row => row.$rowGroupValue));
          const parentGroups = {};
          groupNames.forEach(group => {
            const splitted = group.split('/');
            const iL = splitted.length;

            for (let i = 0; i < iL; i++) {
              splitted.pop();
              parentGroups[splitted.join('/')] = true;
            }
          });

          const parentGroupNames = Object.keys(parentGroups);

          const expandedGroupsArr = [].concat(groupNames).concat(parentGroupNames).sort();

          expandedGroupsArr.forEach(group => {
            const expanded = me.rowGroupExpanded === true? true: me.rowGroupExpanded(group);

            me.expandedGroups[group] = expanded;
          });
          break;
        default:
          me.rowGroupExpanded?.forEach(group => {
            me.expandedGroups[group] = true;
          });
      }

      delete me.rowGroupExpanded;
    },
    generateDisplayedGroupsForFiltering(zeroLevelGroups) {
      const me = this;

      me.displayedGroupsForFiltering = {};

      zeroLevelGroups.forEach(group => {
        me.displayedGroupsForFiltering[group] = true;
      });

      for(let group in me.expandedGroups){
        const subGroups = me.groupsChildrenForFiltering[group];

        subGroups?.forEach(({ $rowGroupValue }) => {
          if ($rowGroupValue) {
            me.displayedGroupsForFiltering[$rowGroupValue] = true;
          }
        });
      }
    },
    sortGroups() {
      const me = this;

      me.levelsWithGroups.forEach(({ 0: groupsContainer }) => {
        for (const group in groupsContainer) {
          const subGroups = groupsContainer[group];
          const newSubGroupsOrder = subGroups.toSorted((a, b) => {
            const groupA = me.groupDetails[a];
            const groupB = me.groupDetails[b];

            switch (me.defaultRowGroupSort) {
              case 'asc-string': return groupA.$rowDisplayGroupValue.localeCompare(groupB.$rowDisplayGroupValue);
              case 'desc-string': return groupB.$rowDisplayGroupValue.localeCompare(groupA.$rowDisplayGroupValue);
              case 'asc-amount': return groupA.amount - groupB.amount;
              case 'desc-amount': return groupB.amount - groupA.amount;
            }
          });

          groupsContainer[group] = newSubGroupsOrder;
        }
      });
    },
    sortGroupsForFiltering() {
      const me = this;
      const levelsWithGroupsForFiltering = [];

      me.levelsWithGroups.forEach(({ 0: groupsContainer }, level) => {
        const filteredGroupsContainer = {};

        for (const group in groupsContainer) {
          const subGroups = groupsContainer[group].filter(value => me.displayedGroupsForFiltering[value]);

          if (me.displayedGroupsForFiltering[group] || level === 0) {
            filteredGroupsContainer[group] = subGroups;
          }
        }

        levelsWithGroupsForFiltering[level] = [filteredGroupsContainer];
      });

      me.levelsWithGroupsForFiltering = levelsWithGroupsForFiltering;
    },
    getSortedDisplayedGroups() {
      const me = this;
      let displayedGroupsSorted = [];

      const recursiveDataExtraction = (levelGroups, level = 0) => {
        levelGroups.forEach((group) => {
          displayedGroupsSorted.push(group);

          if (me.expandedGroups[group] && level !== me.levelsWithGroups.length - 1) {
            const nextLevel = level + 1;
            const levelGroups = me.levelsWithGroups[nextLevel][0][group];

            recursiveDataExtraction(levelGroups, nextLevel);
          }
        });
      };

      // All these with levelsWithGroups and groupDetails looks incorrect
      // It looks like it does sort on levelsWithGroups first and then for some types we do extra sort
      switch (me.defaultRowGroupSort) {
        case 'desc-string':
        case 'asc-string':
        case 'desc-amount':
        case 'asc-amount':
          const zeroLevelGroups = me.levelsWithGroups[0][0].root;
          recursiveDataExtraction(zeroLevelGroups);
          break;
        default: console.error(`FG-Grid: Not supported defaultRowGroupSort value ${me.defaultRowGroupSort}`);
      }

      return displayedGroupsSorted;
    },
    getSortedDisplayedGroupsForFiltering() {
      const me = this;
      let displayedGroupsSorted = [];

      const recursiveDataExtraction = (levelGroups, level = 0) => {
        levelGroups.forEach((group) => {
          displayedGroupsSorted.push(group);

          if (me.expandedGroups[group] && level !== me.levelsWithGroupsForFiltering.length - 1) {
            const nextLevel = level + 1;
            const levelGroups = me.levelsWithGroupsForFiltering[nextLevel][0][group];

            recursiveDataExtraction(levelGroups, nextLevel);
          }
        });
      };

      switch (me.defaultRowGroupSort) {
        case 'desc-string':
          displayedGroupsSorted = Array.from(Object.keys(me.displayedGroupsForFiltering)).sort();
          break;
        case 'desc-amount':
          const zeroLevelGroups = me.levelsWithGroupsForFiltering[0][0].root;
          recursiveDataExtraction(zeroLevelGroups);
          break;
        default: console.error(`FG-Grid: Not supported defaultRowGroupSort value ${me.defaultRowGroupSort}`);
      }

      return displayedGroupsSorted;
    },
    getAggregationResult(aggregation, values) {
      let result = '';

      if (typeof aggregation.fn === 'function') {
        result = aggregation.fn(values);
      } else {
        switch (aggregation.fn) {
          case 'sum':
            result = values.reduce((sum, value) => sum + value, 0);
            break;
          case 'avg':
            const sum = values.reduce((sum, value) => sum + value, 0);
            const avg = parseFloat((sum / values.length).toFixed(2));

            result = avg;
            break;
          case 'min':
            result = values.sort()[0];
            break;
          case 'max':
            result = values.sort()[values.length - 1];
            break;
        }
      }

      return result;
    },
    expand(group) {
      const me = this;
      const groupDetails = me.groupDetails[group];
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = true;
      me.expandedGroups[group] = true;
      if (!groupDetails.$hasChildrenGroups) {
        me.expandedGroupsWithDataChildren[group] = true;
      }

      const groupData = me.getGroupExpandedChildren(group);

      me.displayedData.splice(rowIndex + 1, 0, ...groupData);

      me.updateIndexes();
    },
    expandForFiltering(group) {
      const me = this;
      const groupDetails = me.groupDetailsForFiltering[group];
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = true;
      me.expandedGroups[group] = true;
      if (!groupDetails.$hasChildrenGroups) {
        me.expandedGroupsWithDataChildren[group] = true;
        me.expandedGroupsWithDataChildrenForFiltering[group] = true;
      }

      const groupData = me.getGroupExpandedChildrenForFiltering(group);

      me.displayedData.splice(rowIndex + 1, 0, ...groupData);
      me.updateIndexes();
    },
    expandAll() {
      const me = this;

      me.prevAction = '';

      for (const group in me.groupDetails) {
        const groupDetails = me.groupDetails[group];

        me.expandedGroups[group] = true;
        groupDetails.expanded = true;

        if (!groupDetails.$hasChildrenGroups) {
          me.expandedGroupsWithDataChildren[group] = true;
        }
      }

      me.generateDisplayedGroupedData();
      me.setIndexAndItemsMaps();
    },
    toggleExpand(group) {
      const me = this;
      const groupDetails = me.groupDetails[group];

      groupDetails.expanded? me.collapse(group): me.expand(group);
    },
    collapse(group) {
      const me = this;
      const groupData = me.getGroupExpandedChildren(group);
      const groupDetails = me.groupDetails[group];
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = false;
      delete me.expandedGroups[group];
      if (!groupDetails.$hasChildrenGroups) delete me.expandedGroupsWithDataChildren[group];

      me.displayedData.splice(rowIndex + 1, groupData.length);

      me.updateIndexes();
    },
    collapseForFiltering(group) {
      const me = this;
      const groupDetails = me.groupDetailsForFiltering[group];
      const groupData = me.getGroupExpandedChildrenForFiltering(group);
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = false;
      delete me.expandedGroups[group];
      if (!groupDetails.$hasChildrenGroups) {
        delete me.expandedGroupsWithDataChildren[group];
        delete me.expandedGroupsWithDataChildrenForFiltering[group];
      }

      me.displayedData.splice(rowIndex + 1, groupData.length);

      me.updateIndexes();
    },
    collapseAll() {
      const me = this;

      me.prevAction = '';

      for (const group in me.groupDetails) {
        me.expandedGroups[group] = false;
        me.groupDetails[group].expanded = false;
      }

      me.generateDisplayedGroupedData();
      me.setIndexAndItemsMaps();
    },
    getGroupExpandedChildren(group, groupData = []) {
      const me = this;
      const groupDetails = me.groupDetails[group];
      let groupChildren = me.groupsChildren[group].slice();

      if (!groupDetails.$hasChildrenGroups && me.sorters.length) {
        groupChildren = me.sortPieceOfData(groupChildren);
      }

      groupChildren.forEach(item => {
        groupData.push(item);
        if (item.$isGroupRow && item.expanded) {
          const itemGroup = item.$rowGroupValue;

          me.getGroupExpandedChildren(itemGroup, groupData);
        }
      });

      return groupData;
    },
    getGroupExpandedChildrenForFiltering(group, groupData = []) {
      const me = this;
      const groupDetails = me.groupDetailsForFiltering[group];
      let groupChildren = me.groupsChildrenForFiltering[group].slice();

      if (!groupDetails.$hasChildrenGroups && me.sorters.length) {
        groupChildren = me.sortPieceOfData(groupChildren);
      }

      groupChildren.forEach(item => {
        groupData.push(item);
        if (item.$isGroupRow && item.expanded) {
          const itemGroup = item.$rowGroupValue;

          me.getGroupExpandedChildrenForFiltering(itemGroup, groupData);
        }
      });

      return groupData;
    },
    reConfigRowGroups(rowGroups) {
      const me = this;
      const {
        sorters,
        filters
      } = me;

      me.setRowGroups(rowGroups);

      me.prevAction = '';

      if(!me.$dontDropExpandedGroups){
        me.expandedGroups = {};
      }

      delete me.groupsChildren;
      if (rowGroups.length === 0) {
        me.clearGroups();
        if (!(sorters.length || filters.length)) {
          delete me.displayedData;
        } else {
          // Requires resort and re-filter because sorted and filtered data will be different for grouping.
          if (filters.length) me.reFilter(false);
          if (sorters.length) me.reSort();
        }
      } else {
        if (filters.length) {
          me.set$rowGroupValue();
          me.generateGroupDetails();
          me.sortGroups();

          me.rowGroupDataForFiltering();
          me.sortGroupsForFiltering();
          me.generateDisplayedGroupedDataForFiltering();
          me.updateIndexes();
        } else {
          me.set$rowGroupValue();
          me.generateGroupDetails();
          me.sortGroups();
          me.generateDisplayedGroupedData();
        }
      }

      //??? Maybe a bug, maybe it requires testing sorters.length
      if (!filters.length || !rowGroups.length) me.setIndexAndItemsMaps();
    },
    setRowGroups(rowGroups) {
      this.rowGroups = rowGroups;
    },
    getGroupDataForFiltering() {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildrenForFiltering) {
        if (me.isParentCollapsed(group)) continue;

        const groupData = me.groupsChildrenForFiltering[group].slice();
        const groupDetails = me.groupDetailsForFiltering[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

        sortedData.splice(rowIndex + 1, groupData.length, ...groupData);
      }

      return sortedData;
    },
    addGroup(group){
      const me = this;
      const splitted = group.split('/');

      me.levelsWithGroups = me.levelsWithGroups || [
        [{
          root: []
        }]
      ];
      me.groupsChildren = me.groupsChildren || {};
      me.expandedGroupsWithDataChildren = me.expandedGroupsWithDataChildren || {};
      me.expandedGroups = me.expandedGroups || {};

      me.expandedGroupsWithDataChildren[group] = true;

      const addToGroupsChildren = [];

      for(let i = 0;i<splitted.length;i++){
        const name = splitted.slice(0, splitted.length - i).join('/');
        const groupLevel = name.split('/').length - 1;

        if(me.groupDetails[name]) break;

        const parentGroup = splitted.slice(0, splitted.length - i - 1).join('/');

        if(groupLevel === 0){
          const root = me.levelsWithGroups[0][0].root;
          if(!root.includes(name)) root.push(name);
        }
        else{
          if(me.levelsWithGroups === undefined){
            me.levelsWithGroups = [
              [{
                root: []
              }]
            ];
          }

          if(me.levelsWithGroups[groupLevel] === undefined){
            me.levelsWithGroups[groupLevel] = [{}];
          }

          if(!me.levelsWithGroups[groupLevel][0][parentGroup]){
            me.levelsWithGroups[groupLevel][0][parentGroup] = [];
          }

          me.levelsWithGroups[groupLevel][0][parentGroup].push(name);
        }

        me.expandedGroups[name] = true;
        me.groupsChildren[name] = [];

        me.groupDetails[name] = {
          $rowGroupValue: name,
          $rowDisplayGroupValue: splitted[splitted.length - i - 1],
          $groupLevel: groupLevel,
          $isGroupRow: true,
          $hasChildrenGroups: group !== name,
          id: me.generateId(),
          childrenAmount: 0,
          amount: 0,
          expanded: true,
          $agValues: {}
        };

        addToGroupsChildren.push(name);
      }

      addToGroupsChildren.forEach(group => {
        const splitted = group.split('/');

        if (splitted.length === 1) return;

        const parentGroup = splitted.slice(0, splitted.length - 1).join('/');

        me.groupsChildren[parentGroup] = me.groupsChildren[parentGroup] || [];
        me.groupsChildren[parentGroup].push(me.groupDetails[group]);
      });
    },
    agGroupUpdateData(groupName, items, sign = '-'){
      const me = this;
      const groupDetails = me.groupDetails[groupName];

      // group was removed
      if(!groupDetails) return;

      const groupAgValues = groupDetails.$agValues || {};
      const groupChildren = me.groupsChildren[groupName];

      me.aggregations?.forEach(aggregation => {
        const index = aggregation.index;
        items.forEach(item => {
          if (item.$rowGroupValue.includes(groupName) === false) return;

          // Fast update for parent aggregation value
          if (aggregation.fn === 'sum' && sign !== 'update'){
            if (groupAgValues[index] === undefined) {
              groupAgValues[index] = 0;
            }

            switch (sign) {
              case '-':
                groupAgValues[index] -= item[index];
                break;
              case '+':
                groupAgValues[index] += item[index];
                break;
            }
          }
          else{
            const values = groupChildren.map(child => {
              let value = child.$agValues ? child.$agValues[index] : child[index];
              value = Number(value);
              if (isNaN(value)) (value = 0);

              return value;
            });
            groupAgValues[index] = me.getAggregationResult(aggregation, values);
          }
        });
      });
    },
    isItemInCollapsedGroup(item){
      const splitted = item.$rowGroupValue.split('/');
      const iL = splitted.length;
      item.$isGroupRow && splitted.pop();

      for(let i = 0;i<iL;i++) {
        const name = splitted.join('/');
        const expanded = this.expandedGroups[name];

        if(!expanded) return true;

        splitted.pop();
      }

      return false;
    },
    isParentCollapsed(group) {
      const me = this;
      const splitted = group.split('/');
      const iL = splitted.length - 1;

      for (let i = 0; i < iL; i++) {
        splitted.pop();
        if (!me.expandedGroups[splitted.join('/')]) return true;
      }

      return false;
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinRowGroup);
})();

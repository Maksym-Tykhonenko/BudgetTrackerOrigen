import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type, active }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case 'add':
        imageSource = require('../assets/common/add.png');
        break;
    case 'waste':
        imageSource = require('../assets/common/waste.png');
        break;
    case 'plus':
        imageSource = require('../assets/common/plus.png');
        break;
    case 'minus':
        imageSource = require('../assets/common/minus.png');
        break;
    case 'calendar':
        imageSource = require('../assets/common/calendar.png');
        break;

    case 'statistics':
        imageSource = require('../assets/panel/calendar.png');
        iconStyle.push(styles.panel);
        active && iconStyle.push(styles.active);
        break;
    case 'budget':
        imageSource = require('../assets/panel/budget.png');
        iconStyle.push(styles.panel);
        active && iconStyle.push(styles.active);
        break;
    case 'profile':
        imageSource = require('../assets/panel/profile.png');
        iconStyle.push(styles.panel);
        active && iconStyle.push(styles.active);
        break;
    case 'transactions':
        imageSource = require('../assets/panel/transactions.png');
        iconStyle.push(styles.panel);
        active && iconStyle.push(styles.active);
        break;

    case 'menu':
        imageSource = require('../assets/panel/menu.png');
        iconStyle.push(styles.menu);
        break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  panel: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#b4a7d6'
  },
  active: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#fff'
  },
  menu: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#fff'
  }
});

export default Icons;

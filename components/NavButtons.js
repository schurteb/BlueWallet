import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { useTheme } from '@react-navigation/native';

const BORDER_RADIUS = 0;
const PADDINGS = 0;
const MARGINS = 8;

const cStyles = StyleSheet.create({
  root: {
    position: 'absolute',
    alignSelf: 'center',
    height: '6.3%',
    minHeight: 44,
  },
  rootPre: {
    bottom: -1000,
  },
  rootPost: {
    bottom: 0,
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    overflow: 'hidden',
  },
});

export const NavContainer = ({ children }) => {
  const [newWidth, setNewWidth] = useState();
  const layoutCalculated = useRef(false);

  const onLayout = event => {
    if (layoutCalculated.current) return;
    const maxWidth = Dimensions.get('window').width - BORDER_RADIUS - 20;
    const { width } = event.nativeEvent.layout;
    const withPaddings = Math.ceil(width + PADDINGS * 2);
    const len = React.Children.toArray(children).filter(Boolean).length;

    let newWidth = Math.floor(maxWidth / (len + 1));

    setNewWidth(newWidth);
    layoutCalculated.current = true;
  };

  return (
    <View onLayout={onLayout} style={[cStyles.root, newWidth ? cStyles.rootPost : cStyles.rootPre]}>
      {newWidth
        ? React.Children.toArray(children)
            .filter(Boolean)
            .map((c, index, array) =>
              React.cloneElement(c, {
                width: newWidth,
                key: index,
                first: index === 0,
                last: index === array.length - 1,
              }),
            )
        : children}
    </View>
  );
};

NavContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

const buttonFontSize =
  PixelRatio.roundToNearestPixel(Dimensions.get('window').width / 26) > 22
    ? 22
    : PixelRatio.roundToNearestPixel((Dimensions.get('window').width * 0.75) / 26);

const bStyles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    alignItems: 'center',
  },
  text: {
    fontSize: buttonFontSize,
    alignItems: 'center',
    textAlign: 'center',
  },
});

export const NavButton = ({ text, icon, width, first, last, ...props }) => {
  const { colors } = useTheme();
  const bStylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.buttonAlternativeTextColor,
    },
    text: {
      color: colors.buttonAlternativeTextColor,
    },
  });
  const style = {};

  if (width) {
    const paddingLeft = first ? BORDER_RADIUS / 2 : PADDINGS;
    const paddingRight = last ? BORDER_RADIUS / 2 : PADDINGS;
    style.paddingRight = paddingRight;
    style.paddingLeft = paddingLeft;
    style.marginLeft = MARGINS;
    style.marginRight = MARGINS;
    style.width = width + paddingRight + paddingLeft;
  }

  return (
    <TouchableOpacity style={[bStyles.root, bStylesHook.root, style]} {...props}>
      <View style={bStyles.icon}>
        {icon}
      </View>
      {text !== '' && (
        <Text numberOfLines={1} style={[bStyles.text, bStylesHook.text]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const NavIconButton = ({ icon, width, first, last, ...props }) => {
  const { colors } = useTheme();
  const bStylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.buttonBackgroundColor,
    },
  });
  const style = {};

  if (width) {
    const paddingLeft = first ? BORDER_RADIUS / 2 : PADDINGS;
    const paddingRight = last ? BORDER_RADIUS / 2 : PADDINGS;
    style.paddingRight = paddingRight;
    style.paddingLeft = paddingLeft;
    style.marginLeft = MARGINS;
    style.marginRight = MARGINS;
    style.width = width + paddingRight + paddingLeft;
  }

  // force override of backgroundcolor
  style.backgroundColor = colors.customHeader;

  return (
    <TouchableOpacity style={[bStyles.root, bStylesHook.root, style]} {...props}>
      <View style={bStyles.icon}>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

NavButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  width: PropTypes.number,
  first: PropTypes.bool,
  last: PropTypes.bool,
};

NavIconButton.propTypes = {
  icon: PropTypes.element,
  width: PropTypes.number,
  first: PropTypes.bool,
  last: PropTypes.bool,
};


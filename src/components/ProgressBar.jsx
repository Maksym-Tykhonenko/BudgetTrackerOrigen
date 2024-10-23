import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const ProgressBar = ({ forGoal, goalAmount, waste, limitAmount, color, color2 }) => {
    const radius = 48;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;

    const parsedForGoal = parseFloat(forGoal);
    const parsedGoal = parseFloat(goalAmount);
    const parsedLimit = parseFloat(limitAmount);

    const percentageGoal = parsedGoal > 0 ? (parsedForGoal / parsedGoal) * 100 : 0;
    const percentageLimit = parsedLimit > 0 ? (waste / parsedLimit) * 100 : 0;

    const offsetGoal = circumference - Math.min(percentageGoal, 100) / 100 * circumference;
    const offsetLimit = circumference - Math.min(percentageLimit, 100) / 100 * circumference;

    const isGoalProgress = typeof forGoal !== 'undefined' && typeof goalAmount !== 'undefined';

    return (
        <View style={styles.container}>
            <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
                <Circle
                    stroke="#d9d9d9"
                    fill="none"
                    cx={radius + strokeWidth / 2}
                    cy={radius + strokeWidth / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={isGoalProgress ? color2 : color}
                    fill="none"
                    cx={radius + strokeWidth / 2}
                    cy={radius + strokeWidth / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={isGoalProgress ? offsetGoal : offsetLimit}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
                />
                <SvgText
                    fill="#000"
                    fontSize="18"
                    fontWeight='600'
                    x={radius + strokeWidth / 2}
                    y={radius + strokeWidth / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {`${isGoalProgress ? percentageGoal.toFixed(2) : percentageLimit.toFixed(2)}%`}
                </SvgText>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProgressBar;

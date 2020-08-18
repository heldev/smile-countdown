import React from "react";
import {Text, View} from "react-native"
import {ProgressCircle} from 'react-native-svg-charts'

const Progress = (props) => {
  return (
    <View style={{height: props.height, width: '100%'}}>
      <View style={{height: props.height, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 100, fontWeight: '100'}}>{props.percent}%</Text>
      </View>
      <View style={{height: props.height, marginTop: -props.height}}>
        <ProgressCircle
            style={{height: props.height, width: '100%'}}
            progress={props.percent / 100}
            progressColor='rgb(134, 65, 244)'
            startAngle={-Math.PI * 0.8}
            endAngle={Math.PI * 0.8}/>
      </View>
    </View>
  )
}

export default Progress

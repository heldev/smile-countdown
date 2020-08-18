import React, {useEffect, useState} from 'react'
import {DOMParser} from 'xmldom'
import {select} from 'xpath'
import {Text, View} from "react-native"
import Progress from "./Progress/Progress";

const Countdown = (props) => {
  const [stats, setStats] = useState({})

  useEffect(() => { updateStats(props.session).then(setStats) }, [])

  return (
    <View>
      <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>
        <Text style={{color: 'rgb(44, 0, 128)', fontSize: 30, fontWeight: '100', textAlign: 'center'}}>
          {props.session.full_name}
        </Text>

        <View style={{width: '100%', alignItems: 'center'}}>
          <Progress height={280} percent={stats.percent}/>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={{color: 'rgb(44, 0, 128)', fontSize: 20, fontWeight: '100', textAlign: 'center'}}>
            {stats.nextAligners?.daysMessage}
          </Text>
          <Text style={{fontSize: 20, fontWeight: '100', textAlign: 'center'}}>
            {stats.nextAligners?.dateMessage}
          </Text>
        </View>
      </View>
    </View>
  )
}

const updateStats = (session) => {
  return fetchProgressPage(session).then(extractStats)
}

const fetchProgressPage = (session) => {

  const requestOptions = {
    headers: new Headers({Cookie: `sessionid=${session.sessionId}`}),
    credentials: 'omit'
  };

  return fetch('https://smiledirectclub.com/patient-portal/', requestOptions)
      .then(response => response.text())
      .then(html => html.replace(/&times;/g, 'X'))
      .then(html => {
        return new DOMParser({locator: {}, errorHandler: _ => {}}).parseFromString(html, 'text/html')
      })
}

const extractStats = (document) => {
  const progress = select('//*[contains(@class, "card-treatment")]', document)[0];

  return {
    percent: parseInt(select('string(//*[contains(@class, "days-progress-label")])', document)),
    etaDate: select('string(//*[contains(@class, "countdown-value") and contains(@class, "eta")])', document),
    etaDays: select('string(//*[contains(@class, "countdown-value") and contains(@class, "days")])', document),
    etaSteps: select('string(//*[contains(@class, "countdown-value") and contains(@class, "steps")])', document),
    nextAligners: extractNextAligners(progress)
  }
}

const extractNextAligners = (progress) => {

  const daysMessage = select('string(.//*[contains(@class, "headline")])', progress)
      .trim()
      .replace(/\.$/, '') + ':';

  console.log(`days ${daysMessage}`)

  const dateMessage = select('string(.//*[contains(@class, "description")]//*[local-name(.)="p"][2])', progress)
      .trim();

  return {
    daysMessage,
    dateMessage
  }
}

export default Countdown

import Vue from 'vue'
import styles from '@/assets/styles/global.scss'

export default {
     install  () {
        Vue.prototype.tableHeaderStyle = {
            background: styles.tableHeaderBg,
            color: styles.mainTitleColor,
            fontSize: '14px',
            fontWeight: 500
        }
    }
}
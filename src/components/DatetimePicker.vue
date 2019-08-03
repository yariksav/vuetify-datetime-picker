<template>
  <v-menu
    v-model="display"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    full-width
    :width="width"
    :disabled="disabled"
    :max-width="290"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        slot="activator"
        :value="formattedDatetime"
        :disabled="disabled"
        readonly
        v-bind="$attrs"
        v-on="on"
      >
      </v-text-field>
    </template>
    <v-card flat>
      <v-card-text class="pa-0">
        <v-tabs fixed-tabs v-model="activeTab" flat>
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>event</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="!dateSelected">
            <slot name="timeIcon">
              <v-icon>access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="datePart"
              scrollable
              :locale="locale">
            </v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              class="v-time-picker-custom"
              v-model="timePart"
              scrollable
              :format="timePickerFormat"
            >
            </v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions"
              :parent="this"
        >
          <v-btn color="grey lighten-1" text @click.native="clearHandler">{{clearText}}</v-btn>
          <v-btn color="green darken-1" text @click="okHandler">{{okText}}</v-btn>
          </slot>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
  import moment from 'moment'

  const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
  const DEFAULT_TIME_FORMAT = 'HH:mm'
  const DEFAULT_TIME = '00:00'

  export default {
    name: 'v-datetime-picker',
    model: {
      prop: 'datetime',
      event: 'input'
    },
    props: {
      datetime: {
        type: [Date, String],
        default: null
      },
      width: {
        type: Number,
        default: 320
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss'
      },
      timePickerFormat: {
        type: String,
        default: '24hr'
      },
      locale: {
        type: String
        // default: 'en-us'
      },
      clearText: {
        type: String,
        default: 'CLEAR'
      },
      okText: {
        type: String,
        default: 'OK'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        display: false,
        dateSelected: false,
        timeSelected: false,
        activeTab: 0,
        selectedDatetime: null
      }
    },
    watch: {
      display (val) {
        if (!val) {
          this.okHandler()
        }
      }
    },
    created () {
      if (this.datetime instanceof Date) {
        this.selectedDatetime = this.datetime
      } else if (typeof this.datetime === 'string' || this.datetime instanceof String) {
        // see https://stackoverflow.com/a/9436948
        this.selectedDatetime = moment(this.datetime, this.format).toDate()
      }
    },
    computed: {
      datePart: {
        get () {
          let val = this.selectedDatetime ? moment(this.selectedDatetime).format(DEFAULT_DATE_FORMAT) : ''
          return val
        },
        set (val) {
          this.dateSelected = true
          this.activeTab = 1

          let date = moment(val, DEFAULT_DATE_FORMAT)
          let hour = this.selectedDatetime ? moment(this.selectedDatetime).hour() : 0
          let minute = this.selectedDatetime ? moment(this.selectedDatetime).minute() : 0
          let input = moment().year(date.year()).month(date.month()).date(date.date()).hour(hour).minute(minute).second(0)
          this.selectedDatetime = input.toDate()
        }
      },
      timePart: {
        get () {
          let val = this.selectedDatetime ? moment(this.selectedDatetime).format(DEFAULT_TIME_FORMAT) : DEFAULT_TIME
          return val
        },
        set (val) {
          this.timeSelected = true

          let time = moment(val, DEFAULT_TIME_FORMAT)
          let input = moment(this.selectedDatetime).hour(time.hour()).minute(time.minute()).second(0)
          this.selectedDatetime = input.toDate()
        }
      },
      formattedDatetime () {
        return this.datetime ? moment(this.datetime).format(this.format) : ''
      }
    },
    methods: {
      okHandler () {
        this.display = false
        this.activeTab = 0
        this.$refs.timer && (this.$refs.timer.selectingHour = true)
        this.$emit('input', this.selectedDatetime)
      },
      clearHandler () {
        this.display = false
        this.activeTab = 0
        this.$refs.timer && (this.$refs.timer.selectingHour = true)

        this.$emit('input', null)
      }
    }
  }
</script>

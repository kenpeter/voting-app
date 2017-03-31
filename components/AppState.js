// extendObservable is like obj assign
import { observable, extendObservable } from 'mobx'
// same old api mmethod
import { getObjects, getObject, addObject } from 'cosmicjs'
// lodash
import _ from 'lodash'
// config
import config from '../config'

// all the ob data
export default class AppState {
  // ob, all polls
  @observable polls = []
  // ob, single poll is obj
  @observable poll = {}
  // ob, options selected, why is array
  @observable options_selected = []
  // it is saving, false
  @observable is_saving = false
  // show result, false
  @observable show_results = false
  // not found, null
  @observable not_found = null

  // remote vote count
  removeVoteCount() {
    // why local storage
    // remove item
    // ob, this.poll
    localStorage.removeItem(this.poll._id)
  }

  // vote for one
  // 1 obj
  vote(object) {
    // it is saving.....
    this.is_saving = true
    // if there is write key, so use it
    if (config.cosmicjs.bucket.write_key)
      object.write_key = config.cosmicjs.bucket.write_key

    // add it
    addObject({ bucket: config.cosmicjs.bucket }, object, (err, res) => {
      // Set local storage
      // win local storage
      // this.poll._id
      // _.find, this options_selected is array
      // why another object
      // _find(x, y).value
      window.localStorage.setItem(this.poll._id, _.find(this.options_selected, { poll: this.poll._id }).value)

      // result
      // Go to results page
      this.showResults()
    })
  }

  // show results
  showResults() {
    // get obj
    getObjects({ bucket: config.cosmicjs.bucket }, (err, res) => {
      // ob, is_saving....
      this.is_saving = false
      // ob, poll.vote_counted
      this.poll.vote_counted = true
      // type is votes..........
      if (res.objects) {
        // what exactly is votes.................??????????????????
        const votes = res.objects.type.votes
        // ob, votes
        this.votes = votes
        // ob, show results
        this.show_results = true

        // what exactly is polls...................??????????????
        let polls = res.objects.type.polls

        // get total vote
        polls = this.getVoteTotals(polls, votes)
        const poll_index = _.findIndex(this.polls, { _id: this.poll._id })
        polls[poll_index].vote_counted = true
        this.polls = polls
      }
    })
  }

  // we have poll, we have vote..........
  getVoteTotals(polls, votes) {
    // what is num vote key..........?
    let num_votes_keyed
    // if votes there.
    if (votes) {
      // init num vote key
      num_votes_keyed = []
      // each vote
      votes.forEach(vote => {
        // not, num vote key
        // vote, meta field, zero, value, which is the name of vote......
        if (!num_votes_keyed[vote.metafields[0].value])
          // num vote key
          // vote, meta field, zero, value, zero
          num_votes_keyed[vote.metafields[0].value] = 0

        // +1
        num_votes_keyed[vote.metafields[0].value] = num_votes_keyed[vote.metafields[0].value] + 1
      })
    }

    // each polls, can start diff polls
    polls.forEach((poll, i) => {
      // no num vote key
      // polls[index]... num votes, 0
      if (!num_votes_keyed)
        polls[i].num_votes = 0
      else
        // ......
        // why pass poll._id to num vote key
        polls[i].num_votes = num_votes_keyed[poll._id]
    })
    return polls
  }

  constructor() {
    // Get all polls and votes
    getObjects({ bucket: config.cosmicjs.bucket }, (err, res) => {
      if (res.objects) {
        let polls = res.objects.type.polls
        const votes = res.objects.type.votes
        polls = this.getVoteTotals(polls, votes)
        // If already voted
        polls.forEach((poll, i) => {
          if (window.localStorage.getItem(polls[i]._id)) {
            this.options_selected.push({ poll: polls[i]._id, value: window.localStorage.getItem(polls[i]._id) })
            polls[i].vote_counted = true
          }
        })
        this.polls = polls
        this.votes = votes
        const slug = window.location.pathname.replace('/', '')
        if (slug) {
          const poll = _.find(res.objects.type.polls, { slug })
          if (!poll) {
            console.log('not found')
            this.not_found = true
            return
          }
          this.poll = poll
        }
        // Remove vote for testing
        // this.removeVoteCount()
      }
    })
  }
}

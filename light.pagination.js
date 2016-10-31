/**
 * Created by lwx on 16/10/31.
 */
/**
 * rowCount [number]  row counts of every page
 * pageSize [number]  Number of rows per increase
 * limit    [number]  current pages
 * totalItems  [number] total items
 * start    [number]  start page
 * canPre   [boolean] if can pre
 * startPage[number]  start page
 * canNext  [boolean] if can next
 * activePage  [number]  clicked page
 * skip     [number]  Load from the first few
 * @param id
 * @param option
 * @returns {*}
 */
'use strict';

var React = require('react')
  , ReactDOM = require('react-dom')
  , net = require('./light.net');

module.exports = function (id, option) {
  option = option || {};
  option.rowCount = option.rowCount || 10;
  option.pageSize = option.pageSize || 40;
  return ReactDOM.render(
    React.createElement(Pagination, option),
    document.getElementById(id)
  );
};

var Pagination = React.createClass({
  getInitialState: function () {
    return {
      limit: Math.ceil(this.props.totalItems / this.props.rowCount) > 5 ? 5 : Math.ceil(this.props.totalItems / this.props.rowCount),
      totalItems: this.props.totalItems,
      start: 1,
      canPre: false,
      startPage: 1,
      canNext: true,
      rowCount: this.props.rowCount,
      activePage: 1,
      skip: 0,
      pageSize: this.props.pageSize
    }
  },

  render: function () {
    return React.DOM.div({},
      React.DOM.div({
          className: 'more', style: {
            color: '#72c02c', fontSize: '18px', background: 'none', textAlign: 'center', border: 'solid 1px #e67e22',
            borderRadius: '4px', padding: '5px 13px', marginBottom: '5px', display: this.props.display
          }
        },
        React.DOM.i({className: 'fa fa-flickr', style: {marginRight: '8px'}}), '加载更多'
      ),
      React.DOM.div({className: 'pull-right'},
        React.DOM.ul(
          {className: 'pagination', style: {marginBottom: '0px', marginTop: '0px'}}
          , this.canPrev()
          , this.page()
          , this.canNext()
        )
      )
    )
  },


  page: function () {
    var remainder = Math.ceil((this.state.totalItems - (this.state.startPage - 1) * this.state.rowCount) / this.state.rowCount)
      , limit = remainder > 5 ? 5 : remainder;
    this.setState({limit: limit});
    var pages = [];
    for (var i = this.state.start; i < this.state.start + this.state.limit; i++) {
      if (i == this.state.activePage) {
        pages.push(React.DOM.li({className: 'active'},
          React.DOM.a({href: 'javascript:void(0)', style: {padding: '4px 9px'}, 'data-activePage': i}, i)))
      }
      else {
        pages.push(React.DOM.li({},
          React.DOM.a({href: 'javascript:void(0)', style: {padding: '4px 9px'}, 'data-activePage': i}, i)))
      }
    }
    return pages;
  },

  canPrev: function () {
    if (this.state.startPage > 1) {
      this.setState({canPre: true});
      return React.DOM.li({},
        React.DOM.a({
            className: 'pre',
            href: 'javascript:void(0)',
            style: {padding: '4px 9px'},
            'data-activePage': 'prev'
          },
          React.DOM.i({className: 'fa fa-angle-double-left'}))
      )
    }
    else {
      this.setState({canPre: false});
    }
  },

  canNext: function () {
    if ((this.state.startPage + this.state.limit - 1 < Math.ceil(this.state.totalItems / this.state.rowCount)) && (this.state.limit >= 5)) {
      this.setState({canNext: true});
      return React.DOM.li({},
        React.DOM.a({
            className: 'next',
            href: 'javascript:void(0)',
            style: {padding: '4px 9px'},
            'data-activePage': 'next'
          },
          React.DOM.i({className: 'fa fa-angle-double-right'}))
      )
    }
    else {
      this.setState({canNext: false});
    }
  },

  paginationMore: function () {
    if (this.state.totalItems <= this.state.skip + this.state.pageSize) {
      $('.more').addClass("hide");
    } else {
      $('.more').removeClass("hide");
      this.setState({
        skip: this.state.skip += this.state.pageSize
      }, this.showMore(this.state.skip));
    }
  },

  componentDidMount: function () {
    var node = $(ReactDOM.findDOMNode(this));
    node.unbind("click").on('click', 'a', function (event) {
      if (event.target.tagName == 'A') {
        var activePage = $(event.target).attr("data-activePage");
      } else {
        var activePage = $(event.target.parentNode).attr("data-activePage");
      }

      if (activePage == "prev") {
        if (this.state.startPage == 1) {
          return false;
        } else {
          if (this.state.startPage - 5 < 1) {
            this.show(0);
            this.setState({startPage: 1, activePage: 1})
          }
          else {
            this.show((this.state.startPage - 5 - 1) * this.state.rowCount);
            this.setState({
              startPage: this.state.startPage - 5
              , activePage: this.state.startPage - 5
              , start: this.state.startPage - 5
            })
          }
        }
      } else if (activePage == "next") {
        if (Math.ceil((this.state.totalItems - (this.state.startPage - 1) * this.state.rowCount) / this.state.rowCount) > 5) {
          this.show((this.state.startPage + 5 - 1) * this.state.rowCount);
          this.setState({
            startPage: this.state.startPage + 5
            , activePage: this.state.startPage + 5
            , start: this.state.startPage + 5
          })
        }
        else {
          return false;
        }
      }
      else {
        this.show((activePage - 1) * this.state.rowCount);
        this.setState({activePage: activePage});
      }
    }.bind(this));

    node.on('click', 'div:first-child', function () {
      this.paginationMore();
    }.bind(this));

    node.on('mouseover', 'div:first-child', function (event) {
      $(event.target).css({backgroundColor: '#e67e22'});
    });

    node.on('mouseout', 'div:first-child', function (event) {
      $(event.target).css({backgroundColor: '#fff'});
    });
  },

  show: function (activePage) {
    this.props.show(activePage);
  },

  showMore: function (skip) {
    this.props.showMore(skip)
  }

});

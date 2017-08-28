import React, {PropTypes} from 'react';
import {Icon} from '../coral-ui';
import styles from './Comment.css';
import Slot from 'coral-framework/components/Slot';
import PubDate from '../talk-plugin-pubdate/PubDate';
import CommentContent from '../coral-embed-stream/src/components/CommentContent';
import cn from 'classnames';
import {getTotalReactionsCount} from 'coral-framework/utils';

import t from 'coral-framework/services/i18n';

class Comment extends React.Component {

  render() {
    const {comment, link, data, root} = this.props;
    // console.log(comment.action_summaries, getTotalReactionsCount(comment.action_summaries));

    return (
      <div className={styles.myComment}>
        <div>
          <Slot
            fill="commentContent"
            defaultComponent={CommentContent}
            className={cn(styles.commentBody, 'my-comment-body')}
            data={data}
            queryData={{root, comment, asset: comment.asset}}
          />
          <div className={cn(styles.commentSummary, 'comment_summary')}>
            <span className={cn(styles.commentSummaryReactions, 'comment_summary_reactions')}>
              <Icon name="thumb_up" /> {getTotalReactionsCount(comment.action_summaries)} reactions
            </span>
            
            <span className={cn('comment_summary_replies')}>
              <Icon name="reply" /> {comment.replyCount} replies
            </span>
          </div>
          <div className="my-comment-asset">
            <a className={cn(styles.assetURL, 'my-comment-anchor')}
              href="#"
              onClick={link(`${comment.asset.url}`)}>
              Story: {comment.asset.title ? comment.asset.title : comment.asset.url}
            </a>
          </div>
        </div>
        <div className={styles.sidebar}>
          <ul>
            <li>
              <a onClick={link(`${comment.asset.url}?commentId=${comment.id}`)}>
                <Icon name="open_in_new" className={styles.iconView}/>{t('view_conversation')}
              </a>
            </li>
            <li>
              <Icon name="schedule" className={styles.iconDate} />
              <PubDate
                className={styles.pubdate}
                created_at={comment.created_at}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.string
  }).isRequired,
};

export default Comment;

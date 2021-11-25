const Cast = require('../util/cast');
const MathUtil = require('../util/math-util');
const Timer = require('../util/timer');

/**DB tool */
var dbname = "scratch3.0 db";
var dbversion = "1.0";
var dbdescription = "scratch3.0のDatabase"
var dbsize = 1000;
class Scratch3MotionBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            motion_movesteps: this.moveSteps,
            motion_gotoxy: this.goToXY,
            motion_goto: this.goTo,
            motion_turnright: this.turnRight,
            motion_turnleft: this.turnLeft,
            motion_pointindirection: this.pointInDirection,
            motion_pointtowards: this.pointTowards,
            motion_glidesecstoxy: this.glide,
            motion_glideto: this.glideTo,
            motion_ifonedgebounce: this.ifOnEdgeBounce,
            motion_setrotationstyle: this.setRotationStyle,
            motion_changexby: this.changeX,
            motion_setx: this.setX,
            motion_changeyby: this.changeY,
            motion_sety: this.setY,
            motion_xposition: this.getX,
            motion_yposition: this.getY,
            motion_direction: this.getDirection,
            // Legacy no-op blocks:
            motion_scroll_right: () => {},
            motion_scroll_up: () => {},
            motion_align_scene: () => {},
            motion_xscroll: () => {},
            motion_yscroll: () => {}
        };
    }

    getMonitored () {
        return {
            motion_xposition: {
                isSpriteSpecific: true,
                getId: targetId => `${targetId}_xposition`
            },
            motion_yposition: {
                isSpriteSpecific: true,
                getId: targetId => `${targetId}_yposition`
            },
            motion_direction: {
                isSpriteSpecific: true,
                getId: targetId => `${targetId}_direction`
            }
        };
    }

    moveSteps (args, util) {
        const steps = Cast.toNumber(args.STEPS);
        const radians = MathUtil.degToRad(90 - util.target.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        util.target.setXY(util.target.x + dx, util.target.y + dy);
        console.log('種類：動き：'+steps+'歩動かす');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion',steps+'歩動かす'],
          );
      }
          )
    }

    goToXY (args, util) {
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        util.target.setXY(x, y);
        console.log('種類：動き：x座標を'+x+'y座標を'+y+'にする');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ?)", ['hat_block','motion','x座標を'+x+'y座標を'+y+'にする'],
          );
      }
          )
    }

    getTargetXY (targetName, util) {
        let targetX = 0;
        let targetY = 0;
        if (targetName === '_mouse_') {
            targetX = util.ioQuery('mouse', 'getScratchX');
            targetY = util.ioQuery('mouse', 'getScratchY');
        } else if (targetName === '_random_') {
            const stageWidth = this.runtime.constructor.STAGE_WIDTH;
            const stageHeight = this.runtime.constructor.STAGE_HEIGHT;
            targetX = Math.round(stageWidth * (Math.random() - 0.5));
            targetY = Math.round(stageHeight * (Math.random() - 0.5));
        } else {
            targetName = Cast.toString(targetName);
            const goToTarget = this.runtime.getSpriteTargetByName(targetName);
            if (!goToTarget) return;
            targetX = goToTarget.x;
            targetY = goToTarget.y;
        }
        return [targetX, targetY];
    }

    goTo (args, util) {
        const targetXY = this.getTargetXY(args.TO, util);
        console.log.log('種類：動き：'+targetXY+'へ行く');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion',targetXY+'へ行く'],
          );
      }
          )
        if (targetXY) {
            util.target.setXY(targetXY[0], targetXY[1]);
        }
    }

    turnRight (args, util) {
        const degrees = Cast.toNumber(args.DEGREES);
        util.target.setDirection(util.target.direction + degrees);
        console.log('種類：動き：右に'+degrees+'曲がる');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','右に'+degrees+'度回す'],
          );
      }
          )
    }

    turnLeft (args, util) {
        const degrees = Cast.toNumber(args.DEGREES);
        util.target.setDirection(util.target.direction - degrees);
        console.log('種類：動き：左に'+degrees+'曲がる');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','左に'+degrees+'度回す'],
          );
      }
          )
    }

    pointInDirection (args, util) {
        const direction = Cast.toNumber(args.DIRECTION);
        util.target.setDirection(direction);
        console.log('種類：動き：'+direction+'度に向ける');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion',direction+'度に向ける'],
          );
      }
          )
    }

    pointTowards (args, util) {
        let targetX = 0;
        let targetY = 0;
        if (args.TOWARDS === '_mouse_') {
            targetX = util.ioQuery('mouse', 'getScratchX');
            targetY = util.ioQuery('mouse', 'getScratchY');
        } else if (args.TOWARDS === '_random_') {
            util.target.setDirection(Math.round(Math.random() * 360) - 180);
            return;
        } else {
            args.TOWARDS = Cast.toString(args.TOWARDS);
            const pointTarget = this.runtime.getSpriteTargetByName(args.TOWARDS);
            if (!pointTarget) return;
            targetX = pointTarget.x;
            targetY = pointTarget.y;
        }
        if (args.TOWARDS === '_mouse_') {
            console.log('種類：動き:マウスのポインターへ向ける');
            var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','マウスのポインターへ向ける'],
          );
      }
          )
        } else if (args.TOWARDS === '_random_') {
            console.log('種類：動き:どこかの場所へ向ける');
            var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','どこかの場所へ向ける'],
          );
      }
          )
        } else {
            console.log('種類：動き:'+args.TOWARDS+'へ向ける');
            var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion',args.TOWARDS+'へ向ける'],
          );
      }
          )
        }

        const dx = targetX - util.target.x;
        const dy = targetY - util.target.y;
        const direction = 90 - MathUtil.radToDeg(Math.atan2(dy, dx));
        util.target.setDirection(direction);
    }

    glide (args, util) {
        if (util.stackFrame.timer) {
            const timeElapsed = util.stackFrame.timer.timeElapsed();
            if (timeElapsed < util.stackFrame.duration * 1000) {
                // In progress: move to intermediate position.
                const frac = timeElapsed / (util.stackFrame.duration * 1000);
                const dx = frac * (util.stackFrame.endX - util.stackFrame.startX);
                const dy = frac * (util.stackFrame.endY - util.stackFrame.startY);
                util.target.setXY(
                    util.stackFrame.startX + dx,
                    util.stackFrame.startY + dy
                );
                util.yield();
            } else {
                // Finished: move to final position.
                util.target.setXY(util.stackFrame.endX, util.stackFrame.endY);
                var move_time =util.stackFrame.duration;
                var x_place =util.stackFrame.endX;
                var y_place =util.stackFrame.endY;
                console.log('種類：動き:'+util.stackFrame.duration+'秒でx座標を'+util.stackFrame.endX+'y座標を'+util.stackFrame.endY+'に変える');
                var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion',move_time+'秒でx座標を'+x_place+'に、y座標を'+y_place+'に変える'],
          );
      }
          )
            }
        } else {
            // First time: save data for future use.
            util.stackFrame.timer = new Timer();
            util.stackFrame.timer.start();
            util.stackFrame.duration = Cast.toNumber(args.SECS);
            util.stackFrame.startX = util.target.x;
            util.stackFrame.startY = util.target.y;
            util.stackFrame.endX = Cast.toNumber(args.X);
            util.stackFrame.endY = Cast.toNumber(args.Y);
            if (util.stackFrame.duration <= 0) {
                // Duration too short to glide.
                util.target.setXY(util.stackFrame.endX, util.stackFrame.endY);
                return;
            }
            util.yield();
        }
    }

    glideTo (args, util) {
        const targetXY = this.getTargetXY(args.TO, util);
        if (targetXY) {
            this.glide({SECS: args.SECS, X: targetXY[0], Y: targetXY[1]}, util);
        }
    }

    ifOnEdgeBounce (args, util) {
        const bounds = util.target.getBounds();
        if (!bounds) {
            return;
        }
        // Measure distance to edges.
        // Values are positive when the sprite is far away,
        // and clamped to zero when the sprite is beyond.
        const stageWidth = this.runtime.constructor.STAGE_WIDTH;
        const stageHeight = this.runtime.constructor.STAGE_HEIGHT;
        const distLeft = Math.max(0, (stageWidth / 2) + bounds.left);
        const distTop = Math.max(0, (stageHeight / 2) - bounds.top);
        const distRight = Math.max(0, (stageWidth / 2) - bounds.right);
        const distBottom = Math.max(0, (stageHeight / 2) + bounds.bottom);
        // Find the nearest edge.
        let nearestEdge = '';
        let minDist = Infinity;
        if (distLeft < minDist) {
            minDist = distLeft;
            nearestEdge = 'left';
        }
        if (distTop < minDist) {
            minDist = distTop;
            nearestEdge = 'top';
        }
        if (distRight < minDist) {
            minDist = distRight;
            nearestEdge = 'right';
        }
        if (distBottom < minDist) {
            minDist = distBottom;
            nearestEdge = 'bottom';
        }
        if (minDist > 0) {
            return; // Not touching any edge.
        }
        // Point away from the nearest edge.
        const radians = MathUtil.degToRad(90 - util.target.direction);
        let dx = Math.cos(radians);
        let dy = -Math.sin(radians);
        if (nearestEdge === 'left') {
            dx = Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === 'top') {
            dy = Math.max(0.2, Math.abs(dy));
        } else if (nearestEdge === 'right') {
            dx = 0 - Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === 'bottom') {
            dy = 0 - Math.max(0.2, Math.abs(dy));
        }
        const newDirection = MathUtil.radToDeg(Math.atan2(dy, dx)) + 90;
        util.target.setDirection(newDirection);
        // Keep within the stage.
        const fencedPosition = util.target.keepInFence(util.target.x, util.target.y);
        util.target.setXY(fencedPosition[0], fencedPosition[1]);
        console.log('種類：動き:もし端に着いたら跳ね返る');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','もし端に着いたら跳ね返る'],
          );
      }
          )
    }

    setRotationStyle (args, util) {
        util.target.setRotationStyle(args.STYLE);
        console.count('種類：動き:回転方法を'+args.STYLE+'にする');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','回転方法を'+args.STYLE+'にする'],
          );
      }
          )
    }

    changeX (args, util) {
        const dx = Cast.toNumber(args.DX);
        util.target.setXY(util.target.x + dx, util.target.y);
        console.count('種類：動き:x座標を'+dx+'ずつ変える');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','x座標を'+dx+'ずつ変える'],
          );
      }
          )
    }

    setX (args, util) {
        const x = Cast.toNumber(args.X);
        util.target.setXY(x, util.target.y);
        console.log('種類：動き:x座標を'+x+'にする');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','x座標を'+x+'にする'],
          );
      }
          )
    }

    changeY (args, util) {
        const dy = Cast.toNumber(args.DY);
        util.target.setXY(util.target.x, util.target.y + dy);
        console.log('種類：動き:y座標を'+dy+'ずつ変える');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','y座標を'+dy+'ずつ変える'],
          );
      }
          )
    }

    setY (args, util) {
        const y = Cast.toNumber(args.Y);
        util.target.setXY(util.target.x, y);
        console.log('種類：動き:x座標を'+y+'にする');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['hat_block','motion','y座標を'+y+'にする'],
          );
      }
          )
    }

    getX (args, util) {
        console.log('種類：動き:x座標');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['value_block','motion','x座標'],
          );
      }
          )
        return this.limitPrecision(util.target.x);
    }

    getY (args, util) {
        console.log('種類：動き:y座標');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['value','motion','y座標'],
          );
      }
          )
        return this.limitPrecision(util.target.y);
    }

    getDirection (args, util) {
        console.log('種類：動き:向き');
        var db = window.openDatabase(dbname, dbversion, dbdescription, dbsize);
        db.transaction(function (transact) {
        transact.executeSql("INSERT INTO graduation_research VALUES (?, ?, ? )", ['value_block','motion','向き'],
          );
      }
          )
        return util.target.direction;
    }

    // This corresponds to snapToInteger in Scratch 2
    limitPrecision (coordinate) {
        const rounded = Math.round(coordinate);
        const delta = coordinate - rounded;
        const limitedCoord = (Math.abs(delta) < 1e-9) ? rounded : coordinate;

        return limitedCoord;
    }
}

module.exports = Scratch3MotionBlocks;

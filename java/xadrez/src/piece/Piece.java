package piece;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.awt.Graphics2D;
import javax.imageio.ImageIO;

import main.Board;
import main.GamePanel;

public class Piece {

    public BufferedImage image;
    public int x, y;
    public int col, row, preCol, preRow;
    public int color;
    public Piece hittingP;
    public boolean moved;

    public Piece(int color, int col, int row){

        this.color = color;
        this.col = col;
        this.row = row;
        x = getX(col);
        y = getY(row);
        preCol = col;
        preRow = row;
    }

    public int getX(int col){
        return col * Board.SQUARE_SIZE;
    }
    public int getY(int row){
        return row * Board.SQUARE_SIZE;
    }
    public int getCol(int x){
        return (x + Board.HALF_SQUARE_SIZE)/Board.SQUARE_SIZE;
    }
    public int getRow(int y){
        return (y + Board.HALF_SQUARE_SIZE)/Board.SQUARE_SIZE;
    }

    public int getIndex(){
        for(int index = 0; index < GamePanel.simPieces.size(); index++){
            if(GamePanel.simPieces.get(index) == this){
                return index;
            }
        }
        return 0;
    }
    public void updatePosition(){
        x = getX(col);
        y = getY(row);
        preCol = getCol(x);
        preRow = getRow(y);
        moved = true;
    }
    public void resetPosition(){
        col = preCol;
        row = preRow;
        x = getX(col);
        y = getY(row);
    }
    public boolean canMove(int targetCol, int targetRow){
        return false;
    }
    public boolean isWithinBoard(int targetCol, int targetRow){
        if(targetCol >= 0 && targetCol <= 7 && targetRow >= 0 && targetRow <= 7){
            return true;
        }
        return false;
    }
    public boolean isSameSquare(int targetCol, int targetRow){
        if(targetCol == preCol && targetRow == preRow){
            return true;
        }
        return false;
    }
    public Piece getHittingP(int targetCol, int  targetRow){
        for(Piece piece : GamePanel.simPieces){
            if(piece.col == targetCol && piece.row == targetRow && piece != this){
                return piece;
            }
        }
        return null;
    }
    public boolean isValidSquare(int targetCol, int targetRow){

        hittingP = getHittingP(targetCol, targetRow);

        if(hittingP == null){
            return true; // the square is vacant
        }else{
            if(hittingP.color!= this.color){
                return true; // if the color is different it can be captured
            }else {
                return false; // the square is occupied
            }
        }
    }
    public boolean pieceIsOnStraightLine(int targetCol, int targetRow){
        for(int i = preCol-1; i>targetCol; i--){
            for(Piece piece : GamePanel.simPieces){
                if(piece.col == i && piece.row == targetRow){
                    hittingP = piece;
                    return true;
                }
            }
        }

        for(int i = preCol+1; i<targetCol; i++){
            for(Piece piece : GamePanel.simPieces){
                if(piece.col == i && piece.row == targetRow){
                    hittingP = piece;
                    return true;
                }
            }
        }

        for(int i = preRow-1; i>targetRow; i--){
            for(Piece piece : GamePanel.simPieces){
                if(piece.col == targetCol && piece.row == i){
                    hittingP = piece;
                    return true;
                }
            }
        }

        for(int i = preCol+1; i<targetCol; i++){
            for(Piece piece : GamePanel.simPieces){
                if(piece.col == i && piece.row == targetRow){
                    hittingP = piece;
                    return true;
                }
            }
        }

        return false;
    }

    public boolean pieceIsOnDiagonalLine(int targetCol, int targetRow){
        if(targetRow < preRow){
            for(int i = preCol-1; i>targetCol; i--){
                int dif = Math.abs(i - preCol);
                for(Piece piece : GamePanel.simPieces){
                    if(piece.col == i && piece.row == preRow - dif){
                        hittingP = piece;
                        return true;
                    }
                }
            }

            for(int i = preCol+1; i<targetCol; i++){
                int dif = Math.abs(i - preCol);
                for(Piece piece : GamePanel.simPieces){
                    if(piece.col == i && piece.row == preRow - dif){
                        hittingP = piece;
                        return true;
                    }
                }
            }
        }

        if(targetRow > preRow){
            for(int i = preCol-1; i>targetCol; i--){
                int dif = Math.abs(i - preCol);
                for(Piece piece : GamePanel.simPieces){
                    if(piece.col == i && piece.row == preRow + dif){
                        hittingP = piece;
                        return true;
                    }
                }
            }

            for(int i = preCol+1; i<targetCol; i++){
                int dif = Math.abs(i - preCol);
                for(Piece piece : GamePanel.simPieces){
                    if(piece.col == i && piece.row == preRow + dif){
                        hittingP = piece;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public void draw(Graphics2D g2){
        g2.drawImage(image, x, y, Board.SQUARE_SIZE, Board.SQUARE_SIZE, null);
    }
    public BufferedImage getImage(String imagePath){

        image = null;

        try{
            image = ImageIO.read(getClass().getResourceAsStream(imagePath + ".png" ));
        }catch(IOException e){
            e.printStackTrace();
        }

        return image;
    }

}

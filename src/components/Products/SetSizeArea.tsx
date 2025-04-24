import React, { useState, useCallback, useEffect } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { makeStyles } from "@mui/styles";
import { TextInput } from "../UIkit";
import { SetSizeAreaProps, SizeItem } from "./types";

const useStyles = makeStyles({
  iconCell: {
    width: "48px",
    height: "48px",
  },
  checkIcon: {
    float: "right",
  },
  tableCell: {
    margin: "10px !important",
    marginTop: "30px !important",
  },
});

const SetSizeArea: React.FC<SetSizeAreaProps> = ({ sizes = [], setSizes }: SetSizeAreaProps) => {
  const classes = useStyles();
  const [index, setIndex] = useState<number>(0);
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  const inputSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSize(e.target.value);
    },
    [setSize]
  );

  const inputQuantity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuantity(parseInt(e.target.value, 10));
    },
    [setQuantity]
  );

  const addSize = (index: number, size: string, quantity: number) => {
    if (size === "" || quantity === 0) {
      return false;
    } else {
      if (index === sizes.length) {
        if (setSizes) {
          setSizes([...sizes, { size: size, quantity: quantity }]);
        }
        setIndex(index + 1);
        setSize("");
        setQuantity(0);
        return true;
      } else {
        const newSizes = [...sizes];
        newSizes[index] = { size: size, quantity: quantity };
        if (setSizes) {
          setSizes(newSizes);
        }
        setIndex(newSizes.length);
        setSize("");
        setQuantity(0);
        return true;
      }
    }
  };

  const editSize = (index: number, size: string, quantity: number) => {
    setIndex(index);
    setSize(size);
    setQuantity(quantity);
  };

  const deleteSize = (deleteIndex: number) => {
    const newSizes = sizes.filter((_item, i) => i !== deleteIndex);
    if (setSizes) {
      setSizes(newSizes);
    }
  };

  // 編集の場合にindexを更新する
  useEffect(() => {
    setIndex(sizes.length);
  }, [sizes]);

  return (
    <div>
      <TableContainer component={Paper} sx={{ backgroundColor: "#ffffff94" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>サイズ</TableCell>
              <TableCell>数量</TableCell>
              <TableCell className={classes.iconCell} />
              <TableCell className={classes.iconCell} />
            </TableRow>
          </TableHead>
          <TableBody>
            {sizes.length > 0 &&
              sizes.map((item: SizeItem, i: number) => (
                <TableRow key={item.size}>
                  <TableCell sx={{ marginLeft: "10px" }}>{item.size}</TableCell>
                  <TableCell sx={{ marginLeft: "10px" }}>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      className={classes.iconCell}
                      onClick={() => editSize(i, item.size, item.quantity)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      className={classes.iconCell}
                      onClick={() => deleteSize(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div>
          <TextInput
            fullWidth={false}
            label="サイズ"
            multiline={false}
            required={true}
            rows={1}
            value={size}
            type="text"
            onChange={inputSize}
            className={classes.tableCell}
          />
          <TextInput
            fullWidth={false}
            label="数量"
            multiline={false}
            required={true}
            rows={1}
            value={quantity}
            type="number"
            onChange={inputQuantity}
            className={classes.tableCell}
          />
        </div>
        <IconButton
          className={classes.checkIcon}
          onClick={() => addSize(index, size, quantity)}
        >
          <CheckCircleIcon />
        </IconButton>
      </TableContainer>
    </div>
  );
};

export default SetSizeArea;

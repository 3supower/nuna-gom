import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Order, OrderItem, Product } from '@prisma/client';

// Register a font that supports Korean
Font.register({
    family: 'Noto Sans KR',
    src: 'https://fonts.gstatic.com/s/notosanskr/v13/PbykFmXiEBPT4ITbgNA5Cgm203Tq4JJW-2E91M3F8IO-1E4.ttf'
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Noto Sans KR'
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 5,
        marginBottom: 5
    },
    label: {
        width: 100,
        fontSize: 10,
        color: '#666'
    },
    value: {
        flex: 1,
        fontSize: 10
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingBottom: 5,
        marginTop: 20,
        marginBottom: 10
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingVertical: 8
    },
    colName: { width: '60%', fontSize: 10 },
    colQty: { width: '10%', fontSize: 10, textAlign: 'center' },
    colPrice: { width: '30%', fontSize: 10, textAlign: 'right' },
    total: {
        marginTop: 20,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 'bold'
    }
});

type OrderWithItems = Order & {
    items: (OrderItem & { product: Product })[]
}

export const InvoicePDF = ({ order }: { order: OrderWithItems }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>INVOICE</Text>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Order ID:</Text>
                    <Text style={styles.value}>{order.id}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Customer:</Text>
                    <Text style={styles.value}>{order.customerName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{order.customerEmail || '-'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{order.customerPhone}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{order.address} {order.detailAddress}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.tableHeader}>
                    <Text style={styles.colName}>Item</Text>
                    <Text style={styles.colQty}>Qty</Text>
                    <Text style={styles.colPrice}>Price</Text>
                </View>
                {order.items.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.colName}>{item.product.title}</Text>
                        <Text style={styles.colQty}>{item.quantity}</Text>
                        <Text style={styles.colPrice}>{item.price.toLocaleString()} KRW</Text>
                    </View>
                ))}
                <Text style={styles.total}>Total: {order.totalAmount.toLocaleString()} KRW</Text>
            </View>
        </Page>
    </Document>
);
